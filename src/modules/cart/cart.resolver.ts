import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => Cart)
  async initiateCart(
    @Args('eventId', { type: () => Int }) eventId: number,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Cart> {
    return this.cartService.initiateCart(eventId, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Query(() => Cart)
  async getActiveCart(@DecodedToken() decoded: DecodedAuthToken): Promise<Cart> {
    return this.cartService.getActiveCart(decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => Boolean)
  async abandonActiveCart(@DecodedToken() decoded: DecodedAuthToken): Promise<boolean> {
    return this.cartService.abandonActiveCart(decoded);
  }
}
