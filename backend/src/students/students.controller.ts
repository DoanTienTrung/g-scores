import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FindStudentParams } from './dto/find-student.params';
import { StudentScoresDto } from './dto/student-scores.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get(':sbd')
  @ApiOperation({ summary: 'Look up every subject score for one candidate' })
  @ApiParam({
    name: 'sbd',
    description: 'Registration number, exactly 8 digits',
    example: '01000001',
  })
  @ApiOkResponse({ type: StudentScoresDto })
  @ApiNotFoundResponse({ description: 'No candidate holds that number' })
  @ApiBadRequestResponse({ description: 'The number is not 8 digits' })
  findOne(@Param() params: FindStudentParams): Promise<StudentScoresDto> {
    return this.studentsService.findBySbd(params.sbd);
  }
}
