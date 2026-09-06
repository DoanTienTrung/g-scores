import { ApiProperty } from '@nestjs/swagger';

export class SubjectScoreDto {
  @ApiProperty({ example: 'nguVan', description: 'Stable subject identifier' })
  code!: string;

  @ApiProperty({ example: 'Ngữ văn', description: 'Label for the UI' })
  displayName!: string;

  @ApiProperty({
    example: 6.75,
    nullable: true,
    description: 'null means the candidate did not sit this subject',
  })
  score!: number | null;
}

export class StudentScoresDto {
  @ApiProperty({ example: '01000001' })
  sbd!: string;

  @ApiProperty({ example: 'N1', nullable: true })
  maNgoaiNgu!: string | null;

  @ApiProperty({ type: [SubjectScoreDto] })
  scores!: SubjectScoreDto[];
}
