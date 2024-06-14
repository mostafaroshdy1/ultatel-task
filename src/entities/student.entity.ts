import { ApiProperty } from '@nestjs/swagger';
import { Country } from 'src/common/enums/countries.enum';
import { Gender } from 'src/common/enums/gender.enum';
import { Student } from 'src/models/student.model';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'students' })
@Unique(['email'])
export class StudentEntity implements Student {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  gender: Gender;

  @Column()
  birthDate: Date;

  @Column()
  country: Country;
}
