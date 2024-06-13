export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
}
