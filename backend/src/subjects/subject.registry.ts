import { Subject } from './subject';
import { SubjectGroup } from './subject-group';

/**
 * The single source of truth for exam subjects.
 * Adding a subject means editing this file and nothing else.
 */
export const SUBJECTS = {
  toan: new Subject('toan', 'toan', 'Toán'),
  nguVan: new Subject('nguVan', 'ngu_van', 'Ngữ văn'),
  ngoaiNgu: new Subject('ngoaiNgu', 'ngoai_ngu', 'Ngoại ngữ'),
  vatLi: new Subject('vatLi', 'vat_li', 'Vật lí'),
  hoaHoc: new Subject('hoaHoc', 'hoa_hoc', 'Hoá học'),
  sinhHoc: new Subject('sinhHoc', 'sinh_hoc', 'Sinh học'),
  lichSu: new Subject('lichSu', 'lich_su', 'Lịch sử'),
  diaLi: new Subject('diaLi', 'dia_li', 'Địa lí'),
  gdcd: new Subject('gdcd', 'gdcd', 'Giáo dục công dân'),
} as const;

export const ALL_SUBJECTS: readonly Subject[] = Object.values(SUBJECTS);

export function findSubject(code: string): Subject | undefined {
  return ALL_SUBJECTS.find((subject) => subject.code === code);
}

/**
 * Exam groups. Adding group B would be a single entry here, with no other
 * code change: the query builder reads its columns from the group object.
 */
export const SUBJECT_GROUPS = {
  A: new SubjectGroup('A', 'Khối A', [
    SUBJECTS.toan,
    SUBJECTS.vatLi,
    SUBJECTS.hoaHoc,
  ]),
} as const;

export const ALL_GROUPS: readonly SubjectGroup[] = Object.values(SUBJECT_GROUPS);

/**
 * Resolves a user-supplied group code against the whitelist above.
 * Anything not in the list returns undefined, so no caller can ever push
 * arbitrary text into a SQL statement.
 */
export function findGroup(code: string): SubjectGroup | undefined {
  const normalised = code.trim().toUpperCase();
  return ALL_GROUPS.find((group) => group.code === normalised);
}
