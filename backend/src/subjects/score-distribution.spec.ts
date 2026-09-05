import { ScoreDistribution } from './score-distribution';
import { ScoreLevel } from './score-level';

describe('ScoreDistribution', () => {
  it('counts each scored subject into exactly one level', () => {
    const distribution = new ScoreDistribution();
    distribution.add({ toan: '8.5', nguVan: '6.0', vatLi: '3.9' });

    expect(distribution.toRows()).toEqual(
      expect.arrayContaining([
        { subject: 'toan', level: ScoreLevel.Excellent, total: 1 },
        { subject: 'nguVan', level: ScoreLevel.Good, total: 1 },
        { subject: 'vatLi', level: ScoreLevel.Poor, total: 1 },
      ]),
    );
  });

  it('leaves subjects without a score out of every level', () => {
    const distribution = new ScoreDistribution();
    distribution.add({ toan: '8.5', nguVan: null, vatLi: '' });

    const subjects = distribution.toRows().map((row) => row.subject);
    expect(subjects).toEqual(['toan']);
  });

  it('accumulates rows that fall in the same band', () => {
    const distribution = new ScoreDistribution();
    distribution.add({ toan: '8.0' });
    distribution.add({ toan: '9.5' });
    distribution.add({ toan: '7.9' });

    expect(distribution.toRows()).toEqual(
      expect.arrayContaining([
        { subject: 'toan', level: ScoreLevel.Excellent, total: 2 },
        { subject: 'toan', level: ScoreLevel.Good, total: 1 },
      ]),
    );
  });

  it('starts empty', () => {
    expect(new ScoreDistribution().toRows()).toEqual([]);
  });
});
