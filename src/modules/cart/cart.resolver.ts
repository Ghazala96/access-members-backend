import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

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
}
