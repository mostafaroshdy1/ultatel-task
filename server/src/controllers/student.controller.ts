import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from 'src/dtos/create-student.dto';
import { UpdateStudentDto } from 'src/dtos/update-student.dto';
import { StudentFilterDto } from 'src/dtos/student.filter.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { StudentResponseDto } from 'src/dtos/student-response.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: CreateStudentDto })
  @ApiTags('student')
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiTags('student')
  @Get()
  async findAll(@Query() filters: StudentFilterDto) {
    const [result, total] = await this.studentService.filter(filters);
    return { result, total };
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: CreateStudentDto })
  @ApiTags('student')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const student = await this.studentService.findOne(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: CreateStudentDto })
  @ApiTags('student')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: CreateStudentDto })
  @ApiTags('student')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentService.remove(id);
  }
}
