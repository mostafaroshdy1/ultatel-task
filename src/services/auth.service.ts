import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/dtos/signIn-dto';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    user: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const foundUser = await this.userService.findOneByEmail(user.email);

    if (!foundUser) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(user.password, foundUser.password))) {
      throw new UnauthorizedException();
    }

    return this.createJwtTokens(foundUser);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
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

  async createJwtTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
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
}