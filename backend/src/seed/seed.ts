import 'dotenv/config';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from '../generated/prisma/client';
import { PrismaClient } from '../generated/prisma/client';
import { ScoreDistribution } from '../subjects/score-distribution';
import { parseRow } from './parse-row';

/** Measured fastest: larger batches slow down as Postgres parses the statement. */
const BATCH_SIZE = 2_000;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});

const FILE = process.env.DATASET_PATH as string;
const LIMIT = process.argv[2] ? Number(process.argv[2]) : Infinity;

/** Sampled rather than read once at the end, which would miss the peak. */
function trackPeakMemory() {
  let peakMb = 0;
  const timer = setInterval(() => {
    peakMb = Math.max(peakMb, process.memoryUsage().rss / 1024 / 1024);
  }, 200);

  return {
    stop: () => {
      clearInterval(timer);
      return peakMb;
    },
  };
}

function printSummary(
  rows: number,
  statistics: number,
  seconds: number,
  peakMb: number,
) {
  console.log(`\n  done in ${seconds.toFixed(2)}s`);
  console.log(`  ${Math.round(rows / seconds).toLocaleString('en-US')} rows/second`);
  console.log(`  statistics ${statistics} rows`);
  console.log(`  peak memory ${peakMb.toFixed(0)} MB`);
}

async function main() {
  const startedAt = Date.now();
  const memory = trackPeakMemory();

  // Makes the seeder safe to run again: TRUNCATE is instant, unlike DELETE.
  await prisma.$executeRawUnsafe('TRUNCATE TABLE exam_results, subject_statistics');

  const lines = createInterface({
    input: createReadStream(FILE).pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  const distribution = new ScoreDistribution();
  let batch: Record<string, string | null>[] = [];
  let total = 0;
  let headerSeen = false;

  const flush = async () => {
    if (batch.length === 0) return;
    await prisma.examResult.createMany({
      data: batch as Prisma.ExamResultCreateManyInput[],
    });
    total += batch.length;
    batch = [];
    process.stdout.write(`\r  inserted ${total.toLocaleString('en-US')} rows`);
  };

  for await (const line of lines) {
    if (!line) continue;
    if (!headerSeen) {
      headerSeen = true;
      continue;
    }
    if (total + batch.length >= LIMIT) break;

    const row = parseRow(line.split(','));
    distribution.add(row);
    batch.push(row);
    if (batch.length >= BATCH_SIZE) await flush();
  }
  await flush();

  const statistics = distribution.toRows();
  await prisma.subjectStatistic.createMany({ data: statistics });

  printSummary(total, statistics.length, (Date.now() - startedAt) / 1000, memory.stop());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
