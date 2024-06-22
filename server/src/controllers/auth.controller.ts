import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from 'src/dtos/refresh-token.dto';
import { SignInResponseDto } from 'src/dtos/sign-in-response.dto';
import { SignInDto } from 'src/dtos/signIn-dto';
import { AuthService } from 'src/services/auth.service';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';

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

  @ApiResponse({
    status: 200,
    description: 'Password reset link sent successfully',
  })
  @Get('resetpassword/:email')
  async resetPassword(@Param('email') email: string) {
    await this.authService.resetPassword(email);
    return { message: 'Password reset link sent successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @Post('changepassword')
  async changePassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.changePassword(resetPasswordDto);
    return { message: 'Password changed successfully' };
  }
}
