import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsDto } from './dto/statistics.dto';
import { TopStudentsQuery } from './dto/top-students.query';
import { TopStudentsDto } from './dto/top-students.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Candidate counts per score band, for every subject' })
  @ApiOkResponse({ type: StatisticsDto })
  getStatistics(): Promise<StatisticsDto> {
    return this.reportsService.getStatistics();
  }

  @Get('top-students')
  @ApiOperation({ summary: 'The ten highest combined scores of an exam group' })
  @ApiOkResponse({ type: TopStudentsDto })
  @ApiBadRequestResponse({ description: 'Unknown group code' })
  getTopStudents(@Query() query: TopStudentsQuery): Promise<TopStudentsDto> {
    return this.reportsService.getTopStudents(query.group);
  }
}
