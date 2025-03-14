import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { DecodedAuthToken } from 'src/modules/auth/auth.types';
import { IsPublicKey } from '../decorators/auth/public.decorator';
import { RoleKey, RoleTagsKey } from '../decorators/auth/access-control.decorator';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;
    if (!request['user']) {
      throw new UnauthorizedException();
    }

    const requestUser: DecodedAuthToken = request['user'];
    const requiredRole = this.reflector.get<string>(RoleKey, context.getHandler());
    const requiredRoleTags = this.reflector.get<string[]>(RoleTagsKey, context.getHandler()) || [];
    const userRole: string = requestUser.role;
    const userRoleTags: string[] = requestUser.roleTags || [];

    if (requiredRole && requiredRole !== userRole) {
      throw new ForbiddenException(`Access denied. Requires role: ${requiredRole}`);
    }

    if (requiredRoleTags.length > 0) {
      const hasMatchingRoleTag = userRoleTags.some((tag) => requiredRoleTags.includes(tag));
      if (!hasMatchingRoleTag) {
        throw new ForbiddenException(
          `Access denied. Requires one of role tags: ${requiredRoleTags.join(', ')}`
        );
      }
    }

    return true;
  }
}
