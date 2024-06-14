import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from 'src/dtos/update-student.dto';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { Student } from 'src/models/student.model';
import { StudentRepository } from 'src/repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(
    @Inject(StudentRepository)
    private readonly studentRepository: BaseAbstractRepository<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const { email } = createStudentDto;
    const foundStudent = await this.findOneByEmail(email);
    if (foundStudent) {
      throw new BadRequestException('Email already exists');
    }
    return this.studentRepository.create(createStudentDto);
  }

  findAll() {
    return this.studentRepository.findAll();
  }

  findOne(id: number) {
    return this.studentRepository.findOneById(id);
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.studentRepository.update(id, updateStudentDto);
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOneById(id);
    if (!student) {
      throw new BadRequestException('Student not found');
    }
    return this.studentRepository.remove(student);
  }
  findOneByEmail(email: string): Promise<Student | null> {
    const foundStudent = this.studentRepository.findByCondition({
      where: { email },
    });
    return foundStudent;
  }
}
