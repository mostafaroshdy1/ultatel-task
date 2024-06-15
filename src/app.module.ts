// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { dataSourceOptions } from './db/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { StudentModule } from './modules/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // for environment variables
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
