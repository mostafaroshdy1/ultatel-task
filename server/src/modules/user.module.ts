import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { UserEntity } from 'src/entities/user.entity';
import { MailProcessor } from 'src/processors/mail.processor';
import { UserRepository } from 'src/repositories/user.repository';
import { MailingService } from 'src/services/mailing.service';
import { UserService } from 'src/services/user.service';
import { QueueModule } from './queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), QueueModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
