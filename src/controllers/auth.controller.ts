import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/dtos/refresh-token.dto';
import { SignInResponseDto } from 'src/dtos/sign-in-response.dto';
import { SignInDto } from 'src/dtos/signIn-dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: SignInResponseDto })
  @ApiTags('auth')
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOkResponse({ type: SignInResponseDto })
  @ApiTags('auth')
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }
}
