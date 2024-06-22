import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column({ default: false })
  activated: boolean;

  @Exclude()
  @Column({ nullable: true })
  activationToken: string;

  @Exclude()
  @Column({ nullable: true })
  resetToken: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
