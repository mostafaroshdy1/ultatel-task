import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  isEmail,
} from 'class-validator';
import { Country } from 'src/common/enums/countries.enum';
import { Gender } from 'src/common/enums/gender.enum';
import { Student } from 'src/models/student.model';
import * as sanitizeHtml from 'sanitize-html';

export class CreateStudentDto implements Student {
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsEnum(Country)
  country: Country;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;
}
