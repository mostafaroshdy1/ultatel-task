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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from 'src/services/user.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { MailingService } from 'src/services/mailing.service';
import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailingService: MailingService,
  ) {}

  @ApiCreatedResponse({ type: UserEntity })
  @ApiTags('user')
  @Recaptcha()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // console.log(req.body.recaptcha);
    const activationToken = this.userService.generateRandomToken();
    const createdUser = await this.userService.create(
      createUserDto,
      activationToken,
    );
    this.mailingService.queueUserConfirmation(createdUser, activationToken); // used queue with redis to improve the response time
    return plainToInstance(UserEntity, createdUser);
  }

  @ApiOkResponse({ type: [UserEntity] })
  @ApiTags('user')
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return plainToInstance(UserEntity, users);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedUser = this.userService.remove(id);
    return plainToInstance(UserEntity, deletedUser);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Get('activate/:id/:token')
  async activateUser(@Param('token') token: string, @Param('id') id: number) {
    const activatdUser = await this.userService.activateUser(id, token);
    return plainToInstance(UserEntity, activatdUser);
  }

  @ApiOkResponse({ description: 'Activation email sent' })
  @ApiTags('user')
  @Get('reactivate/:email')
  async reActivate(@Param('email') email: string) {
    const foundUser = await this.userService.findOneByEmail(email);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.activated) {
      throw new BadRequestException('User already activated');
    }

    const activationToken = this.userService.generateRandomToken();
    this.mailingService.queueUserConfirmation(foundUser, activationToken); // used queue with redis to improve the response time
    return { message: 'Activation email sent' };
  }
}
