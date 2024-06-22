import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { SignInDto } from 'src/dtos/signIn-dto';
import { RefreshTokenDto } from 'src/dtos/refresh-token.dto';
import { SignInResponseDto } from 'src/dtos/sign-in-response.dto';
import { MailingService } from './mailing.service';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailingService: MailingService,
  ) {}

  async signIn(
    user: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const foundUser = await this.userService.findOneByEmail(user.email);

    if (!foundUser) throw new NotFoundException('Invalid Email Adress');

    if (!foundUser.activated)
      throw new ForbiddenException('Email is not confirmed');

    if (!(await bcrypt.compare(user.password, foundUser.password)))
      throw new UnauthorizedException();

    return this.createJwtTokens(foundUser);
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<SignInResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const foundUser = await this.userService.findOne(payload.id); // To check if the user still exists incase it was deleted
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      return this.createJwtTokens(foundUser);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async createJwtTokens(user: User): Promise<SignInResponseDto> {
    const payload = { id: user.id, email: user.email }; // To exclude any sensitive information

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    try {
      const token = this.userService.generateRandomToken();
      this.mailingService.queuePasswordReset(user, token);
      const hashedToken = await this.userService.hash(token);
      await this.userService.update(user.id, { resetToken: hashedToken });
    } catch (error) {
      console.error(error);
    }
  }

  async changePassword(data: ResetPasswordDto): Promise<User> {
    const user = await this.userService.findOne(data.userId);

    if (!user) throw new NotFoundException('User not found');

    if (!user.resetToken) throw new UnauthorizedException('Expired token');

    if (!(await bcrypt.compare(data.token, user.resetToken)))
      throw new UnauthorizedException('Invalid token');

    const hashedPassword = await this.userService.hash(data.password);
    return this.userService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
    });
  }
}
