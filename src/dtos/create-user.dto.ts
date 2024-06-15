import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { User } from 'src/models/user.model';
import { Match } from 'src/common/decorators/match';

export class CreateUserDto implements User {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('password') // Custom decorator to check if passwords match
  confirmPassword: string;

  activationToken: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
