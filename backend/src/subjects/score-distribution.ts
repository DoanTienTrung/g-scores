import type { ScoreInput } from './subject';
import { ScoreLevel } from './score-level';
import { ALL_SUBJECTS } from './subject.registry';

export interface DistributionRow {
  subject: string;
  level: ScoreLevel;
  total: number;
}

/**
 * At most 9 subjects x 4 levels = 36 counters, so the whole distribution fits
 * in memory while the seeder streams a million rows past it.
 */
export class ScoreDistribution {
  private readonly counts = new Map<string, DistributionRow>();

  add(row: Record<string, ScoreInput>): void {
    for (const subject of ALL_SUBJECTS) {
      const level = subject.classifyLevel(row[subject.code]);
      if (level === null) continue;

      const key = `${subject.code}:${level}`;
      const counted = this.counts.get(key);

      if (counted) counted.total++;
      else this.counts.set(key, { subject: subject.code, level, total: 1 });
    }
  }

  toRows(): DistributionRow[] {
    return [...this.counts.values()];
  }
}
