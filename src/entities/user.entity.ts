import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Gender, User } from 'src/models/user.model';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
@Unique(['email'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  country: string;
}
