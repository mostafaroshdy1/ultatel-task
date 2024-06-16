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
import {
  Between,
  FindManyOptions,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { StudentFilterDto } from 'src/dtos/student.filter.dto';

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

  async filter(filters: StudentFilterDto): Promise<[Student[], number] | null> {
    const options: any = { where: {} };

    if (filters.name) {
      const [firstName, lastName] = filters.name.split(' ');

      if (firstName) {
        options.where.firstName = Like(`%${firstName}%`);
      }
      if (lastName) {
        options.where.lastName = Like(`%${lastName}%`);
      }
    }

    const currentDate = new Date();

    if (filters.minAge || filters.maxAge) {
      let minDateOfBirth: Date | undefined;
      let maxDateOfBirth: Date | undefined;

      if (filters.minAge) {
        minDateOfBirth = new Date(
          currentDate.getFullYear() - filters.minAge,
          currentDate.getMonth(),
          currentDate.getDate(),
        );
      }

      if (filters.maxAge) {
        maxDateOfBirth = new Date(
          currentDate.getFullYear() - filters.maxAge,
          currentDate.getMonth(),
          currentDate.getDate(),
        );
      }

      if (minDateOfBirth && maxDateOfBirth) {
        options.where.birthDate = Between(maxDateOfBirth, minDateOfBirth);
      } else if (minDateOfBirth) {
        options.where.birthDate = LessThanOrEqual(minDateOfBirth);
      } else if (maxDateOfBirth) {
        options.where.birthDate = MoreThanOrEqual(maxDateOfBirth);
      }
    }

    if (filters.country) {
      options.where.country = filters.country;
    }

    if (filters.gender) {
      options.where.gender = filters.gender;
    }

    // Get the total count of results that match the filters
    const totalResultsPromise = this.studentRepository.count(options);

    if (filters.limit) {
      options.take = filters.limit;

      // Must check if limit is a present first
      if (filters.offset) {
        options.skip = filters.offset;
      }
    }

    const [results, totalResults] = await Promise.all([
      this.studentRepository.findAll(options),
      totalResultsPromise,
    ]);

    return [results, totalResults];
  }
}
