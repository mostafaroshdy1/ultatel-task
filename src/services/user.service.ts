import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private usersRepository: BaseAbstractRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hash(createUserDto.password);
    return this.usersRepository.create(createUserDto);
  }

  findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.findAll(options);
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<User> {
    const foundUser = await this.usersRepository.findOneById(id);
    if (!foundUser) {
      throw new Error('User not found');
    }
    return this.usersRepository.remove(foundUser);
  }

  hash(text: string): string {
    const salt = parseInt(process.env.BCRYPT_SALT);
    return bcrypt.hash(text, salt);
  }
}
