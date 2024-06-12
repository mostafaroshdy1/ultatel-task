import {
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsDate,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { Gender, User } from 'src/models/user.model';
import { ConfigModule } from '@nestjs/config';
// ConfigModule.forRoot({ isGlobal: true });
console.log(process.env.PASSWORD_REGEX);

export class CreateUserDto implements User {
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
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(new RegExp(process.env.PASSWORD_REGEX))
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthdate: Date;

  @ApiProperty()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  country: string;
}
