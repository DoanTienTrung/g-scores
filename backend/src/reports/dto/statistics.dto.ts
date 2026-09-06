import { ApiProperty } from '@nestjs/swagger';

export class ScoreLevelDto {
  @ApiProperty({ example: 1, description: '1 is the highest band' })
  level!: number;

  @ApiProperty({ example: 'Từ 8 điểm' })
  label!: string;
}

export class SubjectStatisticsDto {
  @ApiProperty({ example: 'toan' })
  code!: string;

  @ApiProperty({ example: 'Toán' })
  displayName!: string;

  @ApiProperty({
    example: { '1': 198392, '2': 505836, '3': 258654, '4': 82731 },
    description: 'Candidate count per level',
  })
  counts!: Record<number, number>;

  @ApiProperty({ example: 1045613, description: 'Candidates who sat this subject' })
  total!: number;
}

export class StatisticsDto {
  @ApiProperty({ type: [ScoreLevelDto], description: 'Legend for the chart' })
  levels!: ScoreLevelDto[];

  @ApiProperty({ type: [SubjectStatisticsDto] })
  subjects!: SubjectStatisticsDto[];
}
