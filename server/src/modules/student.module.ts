import { Module } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { StudentController } from 'src/controllers/student.controller';
import { StudentRepository } from 'src/repositories/student.repository';
import { StudentEntity } from 'src/entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
})
export class StudentModule {}
