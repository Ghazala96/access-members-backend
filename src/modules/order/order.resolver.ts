import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => Order)
  async createOrder(
    @Args('cartId', { type: () => Int }) cartId: number,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Order> {
    return this.orderService.createOrder(cartId, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Query(() => [Order])
  async getOrders(@DecodedToken() decoded: DecodedAuthToken): Promise<Order[]> {
    return this.orderService.getOrders(decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Query(() => Order)
  async getOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Order> {
    return this.orderService.getOrder(orderId, decoded);
  }
}
