import { ALL_SUBJECTS } from '../subjects/subject.registry';

/** sbd + 9 subjects + ma_ngoai_ngu */
const EXPECTED_COLUMNS = ALL_SUBJECTS.length + 2;

function emptyToNull(cell: string | undefined): string | null {
  return cell === undefined || cell === '' ? null : cell;
}

/**
 * The dataset has no quoted fields, so callers split the line on ',' first.
 * Scores stay as strings: Prisma parses them straight into Decimal, avoiding
 * the rounding a trip through Number() would introduce.
 */
export function parseRow(cells: string[]): Record<string, string | null> {
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

  return row;
}
