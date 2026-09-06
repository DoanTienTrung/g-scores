export interface SubjectScore {
  code: string;
  displayName: string;
  score: number | null;
}

export interface StudentScores {
  sbd: string;
  maNgoaiNgu: string | null;
  scores: SubjectScore[];
}

export interface ScoreLevel {
  level: number;
  label: string;
}

export interface SubjectStatistics {
  code: string;
  displayName: string;
  counts: Record<string, number>;
  total: number;
}

export interface Statistics {
  levels: ScoreLevel[];
  subjects: SubjectStatistics[];
}

export interface TopStudent {
  rank: number;
  sbd: string;
  total: number;
  scores: SubjectScore[];
}

export interface TopStudents {
  group: string;
  displayName: string;
  subjects: Pick<SubjectScore, 'code' | 'displayName'>[];
  students: TopStudent[];
}

/** Shape the backend's exception filter returns for every error. */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  details?: string[];
  path: string;
  timestamp: string;
}
