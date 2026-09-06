import { Subject } from './subject';

/** A khối: the fixed set of subjects whose scores are summed for admission. */
export class SubjectGroup {
  constructor(
    readonly code: string,
    readonly displayName: string,
    readonly subjects: readonly Subject[],
  ) {}

  /** Always from the registry, never from user input. */
  get columns(): string[] {
    return this.subjects.map((subject) => subject.column);
  }
}
