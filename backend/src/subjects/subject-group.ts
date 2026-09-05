import { Subject } from './subject';

/**
 * An exam group (khối) is a fixed combination of subjects whose scores are
 * summed for university admission. Group A is maths + physics + chemistry.
 */
export class SubjectGroup {
  constructor(
    readonly code: string,
    readonly displayName: string,
    readonly subjects: readonly Subject[],
  ) {}

  /** Database columns to sum. Built from the registry, never from user input. */
  get columns(): string[] {
    return this.subjects.map((subject) => subject.column);
  }
}
