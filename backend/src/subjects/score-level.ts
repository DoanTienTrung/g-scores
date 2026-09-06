/** Values are persisted in `subject_statistics.level`, so they must stay fixed. */
export enum ScoreLevel {
  Excellent = 1,
  Good = 2,
  Average = 3,
  Poor = 4,
}

/** Best band first. Reports iterate this so a new band appears everywhere. */
export const ALL_LEVELS: readonly ScoreLevel[] = [
  ScoreLevel.Excellent,
  ScoreLevel.Good,
  ScoreLevel.Average,
  ScoreLevel.Poor,
];

export const SCORE_LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.Excellent]: 'Từ 8 điểm',
  [ScoreLevel.Good]: 'Từ 6 đến dưới 8',
  [ScoreLevel.Average]: 'Từ 4 đến dưới 6',
  [ScoreLevel.Poor]: 'Dưới 4 điểm',
};
