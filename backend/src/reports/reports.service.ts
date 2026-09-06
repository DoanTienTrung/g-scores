import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ALL_LEVELS, SCORE_LEVEL_LABELS } from '../subjects/score-level';
import { ALL_GROUPS, ALL_SUBJECTS, findGroup } from '../subjects/subject.registry';
import { SubjectGroup } from '../subjects/subject-group';
import { StatisticsDto } from './dto/statistics.dto';
import { TopStudentsDto } from './dto/top-students.dto';

const TOP_SIZE = 10;

/**
 * Column names come from the registry, never from the request. The only
 * user-supplied value was the group code, and it had to match the whitelist.
 */
function buildTopStudentsQuery(group: SubjectGroup): string {
  const quoted = group.columns.map((column) => `"${column}"`);
  const notNull = quoted.map((column) => `${column} IS NOT NULL`).join(' AND ');

  return `SELECT sbd, ${quoted.join(', ')}, (${quoted.join(' + ')}) AS total
            FROM exam_results
           WHERE ${notNull}
           ORDER BY total DESC, sbd ASC
           LIMIT ${TOP_SIZE}`;
}

interface TopRow {
  sbd: string;
  total: string;
  [column: string]: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Reads the 36 rows the seeder precomputed, instead of counting a million. */
  async getStatistics(): Promise<StatisticsDto> {
    const rows = await this.prisma.subjectStatistic.findMany();

    const byKey = new Map(rows.map((r) => [`${r.subject}:${r.level}`, r.total]));

    return {
      levels: ALL_LEVELS.map((level) => ({
        level,
        label: SCORE_LEVEL_LABELS[level],
      })),
      subjects: ALL_SUBJECTS.map((subject) => {
        const counts = Object.fromEntries(
          ALL_LEVELS.map((level) => [
            level,
            byKey.get(`${subject.code}:${level}`) ?? 0,
          ]),
        );
        return {
          code: subject.code,
          displayName: subject.displayName,
          counts,
          total: Object.values(counts).reduce((sum, n) => sum + n, 0),
        };
      }),
    };
  }

  async getTopStudents(groupCode = 'A'): Promise<TopStudentsDto> {
    const group = findGroup(groupCode);

    if (!group) {
      const known = ALL_GROUPS.map((g) => g.code).join(', ');
      throw new BadRequestException(
        `Khối "${groupCode}" không tồn tại. Các khối hiện có: ${known}`,
      );
    }

    const rows = await this.prisma.$queryRawUnsafe<TopRow[]>(
      buildTopStudentsQuery(group),
    );

    return {
      group: group.code,
      displayName: group.displayName,
      subjects: group.subjects.map((subject) => ({
        code: subject.code,
        displayName: subject.displayName,
      })),
      students: rows.map((row, index) => ({
        rank: index + 1,
        sbd: row.sbd,
        total: Number(row.total),
        scores: group.subjects.map((subject) => ({
          code: subject.code,
          displayName: subject.displayName,
          score: Number(row[subject.column]),
        })),
      })),
    };
  }
}
