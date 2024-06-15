import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { StudentEntity } from 'src/entities/student.entity';
import { Student } from 'src/models/student.model';
import { StudentRepositoryInterface } from 'src/interfaces/repositories/student.repository.interface';

@Injectable()
export class StudentRepository
  extends BaseAbstractRepository<Student>
  implements StudentRepositoryInterface
{
  constructor(
    @InjectRepository(StudentEntity) // entity
    private readonly studentRepository: Repository<Student>, // model
  ) {
    super(studentRepository);
  }
}
