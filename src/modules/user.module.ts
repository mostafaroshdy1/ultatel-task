import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { UserEntity } from 'src/entities/user.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
