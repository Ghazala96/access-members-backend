import { Resolver, Query } from '@nestjs/graphql';

import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { UserRole, UserRoleTag } from './user.constants';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { DecodedAuthToken } from '../auth/auth.types';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @AccessControl(UserRole.User)
  @Query(() => User)
  async getProfile(@DecodedToken() decoded: DecodedAuthToken): Promise<User> {
    return this.userService.getProfile(decoded);
  }
}
