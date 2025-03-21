import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';

import { DecodedAuthToken } from 'src/modules/auth/auth.types';
import { AuthSessionKeyPrefix } from '../../modules/auth/auth.constants';
import { IsPublicKey } from '../decorators/auth/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      const payload: DecodedAuthToken = this.jwtService.verify(token, { secret });
      await this.validateSession(payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token or session expired');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  //TODO: Move to auth service
  private async validateSession(payload: DecodedAuthToken) {
    const key = `${AuthSessionKeyPrefix}${payload.sub}`;
    const session: string = await this.cacheManager.get(key);
    if (!session || session.split(':')[0] !== payload.sessionId) {
      throw new UnauthorizedException('Session invalid or expired');
    }
  }
}
