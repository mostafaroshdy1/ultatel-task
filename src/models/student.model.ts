import { Country } from 'src/common/enums/countries.enum';
import { Gender } from 'src/common/enums/gender.enum';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  birthDate: Date;
  country: Country;
}

// src/common/enums/countries.enum.ts
