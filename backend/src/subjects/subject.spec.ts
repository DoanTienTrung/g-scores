import { ScoreLevel } from './score-level';
import { Subject } from './subject';

describe('Subject', () => {
  const toan = new Subject('toan', 'toan', 'Toán');

  describe('classifyLevel — boundaries', () => {
    it.each([
      [10, ScoreLevel.Excellent],
      [8, ScoreLevel.Excellent],
      [7.99, ScoreLevel.Good],
      [6, ScoreLevel.Good],
      [5.99, ScoreLevel.Average],
      [4, ScoreLevel.Average],
      [3.99, ScoreLevel.Poor],
      [0, ScoreLevel.Poor],
    ])('%s belongs to level %s', (score, expected) => {
      expect(toan.classifyLevel(score)).toBe(expected);
    });
  });

  describe('classifyLevel — no score', () => {
    it.each([null, undefined, ''])('%s is not counted in any level', (score) => {
      expect(toan.classifyLevel(score)).toBeNull();
    });
  });

  it('accepts the string form that comes out of the CSV', () => {
    expect(toan.classifyLevel('8.4')).toBe(ScoreLevel.Excellent);
    expect(toan.classifyLevel('3.99')).toBe(ScoreLevel.Poor);
  });

  it('exposes the database column name', () => {
    expect(new Subject('nguVan', 'ngu_van', 'Ngữ văn').column).toBe('ngu_van');
  });
});
