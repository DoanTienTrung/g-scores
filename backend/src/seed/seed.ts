import 'dotenv/config';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from '../generated/prisma/client';
import { PrismaClient } from '../generated/prisma/client';
import type { ScoreInput } from '../subjects/subject';
import { ScoreDistribution } from '../subjects/score-distribution';
import { parseRow } from './parse-row';

/**
 * Rows per INSERT. Large enough that the round trip cost is amortised,
 * small enough that a single statement stays well under Postgres' limits.
 */
const BATCH_SIZE = 2_000;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});

const FILE = process.env.DATASET_PATH as string;
const LIMIT = process.argv[2] ? Number(process.argv[2]) : Infinity;

async function main() {
  const startedAt = Date.now();

  // Sample real process memory so the README number is the peak, not a
  // single reading taken after the work is already done.
  let peakRssMb = 0;
  const sampler = setInterval(() => {
    peakRssMb = Math.max(peakRssMb, process.memoryUsage().rss / 1024 / 1024);
  }, 200);

  // Makes the seeder safe to run again: TRUNCATE is instant, unlike DELETE.
  await prisma.$executeRawUnsafe('TRUNCATE TABLE exam_results, subject_statistics');

  const lines = createInterface({
    input: createReadStream(FILE).pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  const distribution = new ScoreDistribution();
  let batch: Prisma.ExamResultCreateManyInput[] = [];
  let total = 0;
  let headerSeen = false;

  const flush = async () => {
    if (batch.length === 0) return;
    await prisma.examResult.createMany({ data: batch });
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
    distribution.add(row as Record<string, ScoreInput>);
    batch.push(row);
    if (batch.length >= BATCH_SIZE) await flush();
  }
  await flush();

  // 36 rows computed during the same single pass over the file.
  const statistics = distribution.toRows();
  await prisma.subjectStatistic.createMany({ data: statistics });

  clearInterval(sampler);
  const seconds = (Date.now() - startedAt) / 1000;
  console.log(`\n  done in ${seconds.toFixed(2)}s`);
  console.log(`  ${Math.round(total / seconds).toLocaleString('en-US')} rows/second`);
  console.log(`  statistics ${statistics.length} rows`);
  console.log(`  peak memory ${peakRssMb.toFixed(0)} MB`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
