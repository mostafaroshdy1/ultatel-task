import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class StudentResponseDto {
  @ApiProperty({ type: [CreateStudentDto] })
  result: CreateStudentDto[];

  @ApiProperty()
  total: number; //Total number of students before the limit and the offset
}
