import { ALL_SUBJECTS, SUBJECT_GROUPS, findGroup } from './subject.registry';

describe('subject registry', () => {
  it('holds the nine exam subjects in CSV column order', () => {
    expect(ALL_SUBJECTS.map((s) => s.column)).toEqual([
      'toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc',
      'sinh_hoc', 'lich_su', 'dia_li', 'gdcd',
    ]);
  });

  it('keeps codes and columns unique', () => {
    expect(new Set(ALL_SUBJECTS.map((s) => s.code)).size).toBe(9);
    expect(new Set(ALL_SUBJECTS.map((s) => s.column)).size).toBe(9);
  });
});

describe('subject groups', () => {
  it('defines group A as maths, physics and chemistry', () => {
    expect(SUBJECT_GROUPS.A.columns).toEqual(['toan', 'vat_li', 'hoa_hoc']);
  });

  it('looks a group up regardless of case', () => {
    expect(findGroup('a')?.code).toBe('A');
  });

  it('returns undefined for an unknown group', () => {
    expect(findGroup('Z')).toBeUndefined();
  });

  it('never resolves a crafted string to a group', () => {
    expect(findGroup("A'; DROP TABLE exam_results--")).toBeUndefined();
  });
});
