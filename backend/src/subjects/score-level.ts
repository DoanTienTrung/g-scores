/**
 * The four score bands defined by the assignment:
 *   >= 8 | 6 <= x < 8 | 4 <= x < 6 | < 4
 * Numeric values are stored in the `level` column of `subject_statistics`.
 */
export enum ScoreLevel {
  Excellent = 1,
  Good = 2,
  Average = 3,
  Poor = 4,
}

/** Labels shown in the UI (Vietnamese, per the language convention). */
export const SCORE_LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.Excellent]: 'Từ 8 điểm',
  [ScoreLevel.Good]: 'Từ 6 đến dưới 8',
  [ScoreLevel.Average]: 'Từ 4 đến dưới 6',
  [ScoreLevel.Poor]: 'Dưới 4 điểm',
};
