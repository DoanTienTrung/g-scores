import { ScoreLevel } from './score-level';

/** Scores arrive as strings from the CSV and as Decimal from Prisma. */
export type ScoreInput = number | string | null | undefined;

export class Subject {
  constructor(
    /** Used in API responses and in `subject_statistics.subject`. */
    readonly code: string,
    /** Column in `exam_results`, and also the CSV header. */
    readonly column: string,
    readonly displayName: string,
  ) {}

  /** Null means the candidate did not sit the subject, which is not the same as scoring zero. */
  classifyLevel(score: ScoreInput): ScoreLevel | null {
    if (score === null || score === undefined || score === '') return null;

    const value = Number(score);
    if (Number.isNaN(value)) return null;

    if (value >= 8) return ScoreLevel.Excellent;
    if (value >= 6) return ScoreLevel.Good;
    if (value >= 4) return ScoreLevel.Average;
    return ScoreLevel.Poor;
  }
}
