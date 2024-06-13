import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from 'src/services/user.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ type: UserEntity })
  @ApiTags('user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return plainToInstance(UserEntity, createdUser);
  }

  @ApiOkResponse({ type: [UserEntity] })
  @ApiTags('user')
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return plainToInstance(UserEntity, users);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserEntity, user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const editedUser = this.userService.update(id, updateUserDto);
    return plainToInstance(UserEntity, editedUser);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedUser = this.userService.remove(id);
    return plainToInstance(UserEntity, deletedUser);
  }
}
