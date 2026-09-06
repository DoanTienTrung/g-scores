import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ALL_SUBJECTS } from '../subjects/subject.registry';
import { StudentScoresDto } from './dto/student-scores.dto';

/** Columns are read by name from the registry, and Prisma returns Decimal. */
function readScore(row: Record<string, unknown>, code: string): number | null {
  const value = row[code];
  return value == null ? null : Number(value);
}

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySbd(sbd: string): Promise<StudentScoresDto> {
    const result = await this.prisma.examResult.findUnique({ where: { sbd } });

    if (!result) {
      throw new NotFoundException(`Không tìm thấy số báo danh ${sbd}`);
    }

    const row = result as Record<string, unknown>;

    return {
      sbd: result.sbd,
      maNgoaiNgu: result.maNgoaiNgu,
      // Driven by the registry, so a new subject needs no change here.
      scores: ALL_SUBJECTS.map((subject) => ({
        code: subject.code,
        displayName: subject.displayName,
        score: readScore(row, subject.code),
      })),
    };
  }
}
