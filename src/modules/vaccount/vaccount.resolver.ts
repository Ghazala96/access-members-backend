import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { VAccountService } from './vaccount.service';
import { VAccount } from './entities/vaccount.entity';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';
import { MakeDepositInput } from './dtos/make-deposit.input';

@Resolver(() => VAccount)
export class VAccountResolver {
  constructor(private readonly vAccountService: VAccountService) {}

  // For illustration purposes only
  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Mutation(() => Boolean)
  async makeDeposit(
    @Args('input', { type: () => MakeDepositInput }) input: MakeDepositInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<boolean> {
    return this.vAccountService.makeDeposit(input, decoded);
  }
}
