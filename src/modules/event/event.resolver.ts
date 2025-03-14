import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AccessControl } from 'src/common/decorators/auth/access-control.decorator';
import { DecodedToken } from 'src/common/decorators/auth/decoded-token.decorator';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dtos/create-event.input';
import { CreateEventFromTemplateInput } from './dtos/create-event-from-template.input';
import { UserRole, UserRoleTag } from '../user/user.constants';
import { DecodedAuthToken } from '../auth/auth.types';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @AccessControl(UserRole.User, UserRoleTag.User.Organizer)
  @Mutation(() => Event)
  async createEvent(
    @Args('input') input: CreateEventInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Event> {
    console.log('createEvent: ', input);
    return this.eventService.createEvent(input, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Organizer)
  @Mutation(() => Event)
  async createEventFromTemplate(
    @Args('input') input: CreateEventFromTemplateInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Event> {
    return this.eventService.createEventFromTemplate(input, decoded);
  }
}
