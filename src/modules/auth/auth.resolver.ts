import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { Public } from 'src/common/decorators/auth/public.decorator';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth.response';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String) // Temporary query to satisfy GraphQL
  healthCheck(): string {
    return 'GraphQL API is running!';
  }

  @Public()
  @Mutation(() => AuthResponse, { name: 'register' })
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }
}
