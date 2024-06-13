import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private usersRepository: BaseAbstractRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const foundUser = await this.findOneByEmail(email);
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    createUserDto.password = await this.hash(createUserDto.password);
    return this.usersRepository.create(createUserDto);
  }

  findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.findAll(options);
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneById(id);
  }

  findOneByEmail(email: string): Promise<User | null> {
    const foundUser = this.usersRepository.findByCondition({
      where: { email },
    });
    return foundUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<User> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.remove(foundUser);
  }

  hash(text: string): string {
    const salt = parseInt(process.env.BCRYPT_SALT);
    return bcrypt.hash(text, salt);
  }
}
