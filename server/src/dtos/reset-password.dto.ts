import { ParseIntPipe } from '@nestjs/common';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class ResetPasswordDto {
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  userId: number;
}
