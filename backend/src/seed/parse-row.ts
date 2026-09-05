import type { Prisma } from '../generated/prisma/client';
import { ALL_SUBJECTS } from '../subjects/subject.registry';

/** sbd + 9 subjects + ma_ngoai_ngu */
const EXPECTED_COLUMNS = ALL_SUBJECTS.length + 2;

/**
 * The dataset has no quoted fields, so callers split on ',' and pass the
 * cells here. Verified in Phase 1 and recorded in the README.
 */
function emptyToNull(cell: string | undefined): string | null {
  return cell === undefined || cell === '' ? null : cell;
}

/**
 * Turns one CSV line into a row ready for Prisma.
 * Scores stay as strings: Prisma parses them into Decimal, which avoids the
 * float rounding a Number() round trip would introduce.
 */
export function parseRow(cells: string[]): Prisma.ExamResultCreateManyInput {
  if (cells.length !== EXPECTED_COLUMNS) {
    throw new Error(
      `Expected ${EXPECTED_COLUMNS} columns, received ${cells.length}`,
    );
  }

  const row: Record<string, string | null> = {
    sbd: cells[0],
    maNgoaiNgu: emptyToNull(cells[EXPECTED_COLUMNS - 1]),
  };

  // Column order is asserted by subject.registry.spec.ts.
  ALL_SUBJECTS.forEach((subject, index) => {
    row[subject.code] = emptyToNull(cells[index + 1]);
  });

  return row as Prisma.ExamResultCreateManyInput;
}
