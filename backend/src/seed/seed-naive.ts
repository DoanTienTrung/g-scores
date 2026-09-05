/**
 * Deliberately naive seeder, kept as a baseline for the README numbers.
 * Reads the whole file into memory and inserts one row per query.
 * Run on a small slice only: `npm run seed:naive -- 10000`
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});

const LIMIT = Number(process.argv[2] ?? 10_000);
const FILE = process.env.DATASET_PATH as string;

async function main() {
  const startedAt = Date.now();

  // Naive step 1: decompress and hold the entire 42 MB in memory.
  const text = gunzipSync(readFileSync(FILE)).toString('utf8');
  const lines = text.split('\n');
  const readMs = Date.now() - startedAt;

  const insertStartedAt = Date.now();
  let inserted = 0;

  // Naive step 2: one INSERT round trip per row.
  for (let i = 1; i < lines.length && inserted < LIMIT; i++) {
    const line = lines[i];
    if (!line) continue;
    const c = line.split(',');

    await prisma.examResult.create({
      data: {
        sbd: c[0],
        toan: c[1] || null,
        nguVan: c[2] || null,
        ngoaiNgu: c[3] || null,
        vatLi: c[4] || null,
        hoaHoc: c[5] || null,
        sinhHoc: c[6] || null,
        lichSu: c[7] || null,
        diaLi: c[8] || null,
        gdcd: c[9] || null,
        maNgoaiNgu: c[10] || null,
      },
    });
    inserted++;
  }

  const insertMs = Date.now() - insertStartedAt;
  const perRow = insertMs / inserted;

  console.log(`read + decompress : ${(readMs / 1000).toFixed(2)}s`);
  console.log(`inserted          : ${inserted.toLocaleString('en-US')} rows in ${(insertMs / 1000).toFixed(2)}s`);
  console.log(`per row           : ${perRow.toFixed(2)}ms`);
  console.log(`extrapolated 1.06M: ${((perRow * 1_061_605) / 60_000).toFixed(1)} minutes`);
  console.log(`peak heap         : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} MB`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
