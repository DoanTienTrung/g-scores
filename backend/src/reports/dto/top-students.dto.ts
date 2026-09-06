import { ApiProperty } from '@nestjs/swagger';

export class TopStudentScoreDto {
  @ApiProperty({ example: 'toan' })
  code!: string;

  @ApiProperty({ example: 'Toán' })
  displayName!: string;

  @ApiProperty({ example: 9.4 })
  score!: number;
}

export class TopStudentDto {
  @ApiProperty({ example: 1 })
  rank!: number;

  @ApiProperty({ example: '01095066' })
  sbd!: string;

  @ApiProperty({ example: 29.15 })
  total!: number;

  @ApiProperty({ type: [TopStudentScoreDto] })
  scores!: TopStudentScoreDto[];
}

export class TopStudentsDto {
  @ApiProperty({ example: 'A' })
  group!: string;

  @ApiProperty({ example: 'Khối A' })
  displayName!: string;

  @ApiProperty({ type: [TopStudentScoreDto] })
  subjects!: Pick<TopStudentScoreDto, 'code' | 'displayName'>[];

  @ApiProperty({ type: [TopStudentDto] })
  students!: TopStudentDto[];
}
