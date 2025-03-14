import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dtos/create-ticket.input';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Organizer)
  @Mutation(() => [Ticket])
  async createTickets(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('input', { type: () => [CreateTicketInput] }) input: CreateTicketInput[],
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Ticket[]> {
    return this.ticketService.createTickets(eventId, input, decoded);
  }
}
