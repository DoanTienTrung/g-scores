import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TopStudentsQuery {
  @ApiPropertyOptional({
    example: 'A',
    default: 'A',
    description: 'Exam group code; resolved against the registry whitelist',
  })
  @IsOptional()
  @IsString()
  group?: string;
}
