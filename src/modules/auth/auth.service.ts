import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

import { AuthSessionKeyPrefix } from './auth.constants';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth.response';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.userService.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('Invalid email'); // Ambiguous error message to protect against enumeration attacks
    }

    const user = await this.userService.createUser(input);
    const { accessToken, refreshToken } = await this.generateJwtTokens(user);

    return { user, accessToken, refreshToken };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateJwtTokens(user);

    return { user, accessToken, refreshToken };
  }

  async logout(userId: string) {
    const key = this.composeAuthSessionKey(userId);
    const sessionDeleted: boolean = await this.cacheManager.del(key);
    if (!sessionDeleted) {
      throw new InternalServerErrorException('Failed to log out and delete session');
    }

    return;
  }

  async refreshToken(refreshToken: string) {
    let refreshTokenPayload: any;

    try {
      refreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!refreshTokenPayload || !refreshTokenPayload.sub || !refreshTokenPayload.sessionId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const key = this.composeAuthSessionKey(refreshTokenPayload.sub);
    const session: string = await this.cacheManager.get(key);
    if (!session || session.split(':')[1] !== refreshTokenPayload.sessionId) {
      throw new UnauthorizedException('Session invalid or expired');
    }

    const user = await this.userService.findById(refreshTokenPayload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessTokenSessionId = createId();
    const accessToken = this.generateAccessToken(user, accessTokenSessionId);
    const newSession = `${accessTokenSessionId}:${refreshTokenPayload.sessionId}`;
    await this.cacheManager.set(key, newSession);

    return { accessToken };
  }

  private async generateJwtTokens(user: User) {
    const accessTokenSessionId = createId();
    const refreshTokenSessionId = createId();
    const accessToken = this.generateAccessToken(user, accessTokenSessionId);
    const refreshToken = this.generateRefreshToken(user, refreshTokenSessionId);
    const key = this.composeAuthSessionKey(user.id.toString());
    const session = `${accessTokenSessionId}:${refreshTokenSessionId}`;
    await this.cacheManager.set(key, session);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: User, sessionId: string) {
    const payload = {
      sessionId,
      sub: user.id,
      role: user.role.name,
      roleTags: user.roleTags.map((roleTag) => roleTag.name)
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')
    });

    return accessToken;
  }

  private generateRefreshToken(user: User, sessionId: string) {
    const payload = {
      sessionId,
      sub: user.id
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')
    });

    return refreshToken;
  }

  private composeAuthSessionKey(userId: string) {
    return `${AuthSessionKeyPrefix}${userId}`;
  }
}
