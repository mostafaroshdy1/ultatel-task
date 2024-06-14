import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from '../interfaces/repositories/user.repository.interface';
import { UserEntity } from 'src/entities/user.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { User } from 'src/models/user.model';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity) // entity
    private readonly userRepository: Repository<User>, // model
  ) {
    super(userRepository);
  }
}
