import { ScoreLevel } from './score-level';

/** A raw score as it arrives from the CSV, from Prisma, or from a query. */
export type ScoreInput = number | string | null | undefined;

export class Subject {
  constructor(
    /** Stable identifier used in APIs and in `subject_statistics.subject`. */
    readonly code: string,
    /** Column name in `exam_results`, also the CSV header. */
    readonly column: string,
    /** Label shown to users. */
    readonly displayName: string,
  ) {}

  /**
   * Maps a score to one of the four bands.
   * Returns null when the candidate did not sit this subject, which is
   * different from scoring zero — both occur in the dataset.
   */
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
