export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  activationToken: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
