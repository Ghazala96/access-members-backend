import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';

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
    @Args('event') inputEvent: CreateEventInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Event> {
    return this.eventService.createEvent(inputEvent, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Organizer)
  @Mutation(() => Event)
  async createEventFromTemplate(
    @Args('templateId', { type: () => Int }) templateId: number,
    @Args('event') inputEvent: CreateEventFromTemplateInput,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Event> {
    return this.eventService.createEventFromTemplate(templateId, inputEvent, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Organizer)
  @Mutation(() => Event)
  async listEvent(
    @Args('eventId', { type: () => Int }) eventId: number,
    @DecodedToken() decoded: DecodedAuthToken
  ): Promise<Event> {
    return this.eventService.listEvent(eventId, decoded);
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Query(() => [Event])
  async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @AccessControl(UserRole.User, UserRoleTag.User.Attendee)
  @Query(() => Event)
  async getEvent(@Args('eventId', { type: () => Int }) eventId: number): Promise<Event> {
    return this.eventService.getEvent(eventId);
  }
}
