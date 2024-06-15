import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private usersRepository: BaseAbstractRepository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    activationToken: string,
  ): Promise<User> {
    const { email } = createUserDto;
    const foundUser = await this.findOneByEmail(email);
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    // Used promise.all to hash password and activation token in parallel using thread pool
    const [hashedPassword, hashedActivationToken] = await Promise.all([
      this.hash(createUserDto.password),
      this.hash(activationToken),
    ]);
    createUserDto.password = hashedPassword;
    createUserDto.activationToken = hashedActivationToken;
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
  async findOneByActivationToken(token: string): Promise<User | null> {
    const activationToken = await this.hash(token);
    const foundUser = this.usersRepository.findByCondition({
      where: { activationToken },
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
  generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async activateUser(id: number, token: string): Promise<User> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new NotFoundException('Invalid activation token');
    }
    const hashedToken = await this.hash(token);
    if (
      !foundUser.activationToken &&
      foundUser.activationToken !== hashedToken
    ) {
      throw new NotFoundException('Invalid activation token');
    }

    return this.update(foundUser.id, {
      activated: true,
    });
  }
}
