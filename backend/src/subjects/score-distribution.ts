import type { ScoreInput } from './subject';
import { ScoreLevel } from './score-level';
import { ALL_SUBJECTS } from './subject.registry';

export interface DistributionRow {
  subject: string;
  level: ScoreLevel;
  total: number;
}

/**
 * Counts scores into the four bands, one counter per (subject, level).
 *
 * The whole distribution is at most 9 subjects x 4 levels = 36 numbers, so it
 * stays in memory while the seeder streams a million rows past it, and is
 * written once at the end. Reports then read 36 rows instead of scanning the
 * full table on every request.
 */
export class ScoreDistribution {
  private readonly counts = new Map<string, number>();

  add(row: Record<string, ScoreInput>): void {
    for (const subject of ALL_SUBJECTS) {
      const level = subject.classifyLevel(row[subject.code]);
      if (level === null) continue;

      const key = `${subject.code}:${level}`;
      this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
    }
  }

  toRows(): DistributionRow[] {
    return [...this.counts.entries()].map(([key, total]) => {
      const [subject, level] = key.split(':');
      return { subject, level: Number(level) as ScoreLevel, total };
    });
  }
}
