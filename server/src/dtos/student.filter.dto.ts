// student-filter.dto.ts

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Country } from 'src/common/enums/countries.enum';
import { Gender } from 'src/common/enums/gender.enum';

export class StudentFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  minAge?: number;

  @IsOptional()
  @IsString()
  maxAge?: number;

  @IsOptional()
  @IsString()
  @IsEnum(Country)
  country?: Country;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  limit?: number;

  @IsOptional()
  @IsString()
  offset?: number;

  @IsOptional()
  @IsEnum(['name', 'birthDate', 'country', 'gender', 'email'])
  orderBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string;
}
