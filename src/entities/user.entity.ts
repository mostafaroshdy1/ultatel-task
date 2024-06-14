import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from 'src/models/user.model';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
@Unique(['email'])
export class UserEntity implements User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  fullName: string;

  @ApiProperty()
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;
}
