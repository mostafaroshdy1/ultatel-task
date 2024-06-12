export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  birthdate: Date;
  country: string;
  password: string;
}
