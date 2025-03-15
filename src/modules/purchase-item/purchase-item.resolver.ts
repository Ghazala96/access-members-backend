import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';
import { PurchaseItem } from './entities/purchase-item.entity';
import { AddPurchaseItemInput } from './dtos/add-purchase-item.input';
import { PurchaseItemService } from './purchase-item.service';
import { UpdatePurchaseItemInput } from './dtos/update-purchase-item.input';

@Resolver(() => PurchaseItem)
export class PurchaseItemResolver {
  constructor(private readonly purchaseItemService: PurchaseItemService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => PurchaseItem)
  async addPurchaseItem(
    @Args('cartId', { type: () => Int }) cartId: number,
    @Args('item', { type: () => AddPurchaseItemInput }) inputItem: AddPurchaseItemInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<PurchaseItem> {
    return this.purchaseItemService.addPurchaseItem(cartId, inputItem, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => PurchaseItem)
  async updatePurchaseItem(
    @Args('purchaseItemId', { type: () => Int }) purchaseItemId: number,
    @Args('input', { type: () => UpdatePurchaseItemInput }) input: UpdatePurchaseItemInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<PurchaseItem> {
    return this.purchaseItemService.updatePurchaseItem(purchaseItemId, input, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => Boolean)
  async removePurchaseItem(
    @Args('purchaseItemId', { type: () => Int }) purchaseItemId: number,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<boolean> {
    return this.purchaseItemService.removePurchaseItem(purchaseItemId, decoded);
  }
}
