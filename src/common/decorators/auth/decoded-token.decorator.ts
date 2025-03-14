import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { DecodedAuthToken } from 'src/modules/auth/auth.types';

export const DecodedToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedAuthToken => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user as DecodedAuthToken;
  }
);
