import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { Public } from 'src/common/decorators/auth/public.decorator';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth.response';
import { LoginInput } from './dto/login.input';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { DecodedAuthToken } from './auth.types';
import { RefreshTokenResponse } from './dto/refresh-token.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String) // Temporary query to satisfy GraphQL
  healthCheck(): string {
    return 'GraphQL API is running!';
  }

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  async logout(@DecodedToken() decoded: DecodedAuthToken): Promise<boolean> {
    return this.authService.logout(decoded.sub);
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
