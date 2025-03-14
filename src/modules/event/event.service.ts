import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';

import { convertFromDateStringToDateTime } from 'src/common/utils';
import { Event } from './entities/event.entity';
import { EventTemplate } from './entities/event-template.entity';
import { CreateEventInput } from './dtos/create-event.input';
import { DecodedAuthToken } from '../auth/auth.types';
import { UserService } from '../user/user.service';
import { CreateEventFromTemplateInput } from './dtos/create-event-from-template.input';
import { EventStatus } from './event.constants';
import { Ticket } from '../ticket/entities/ticket.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventTemplate) private readonly eventTemplateRepo: Repository<EventTemplate>,
    private readonly userService: UserService
  ) {}

  async createEvent(input: CreateEventInput, decoded: DecodedAuthToken): Promise<Event> {
    const { name, description, date } = input;

    const user = await this.userService.validateUser(decoded.sub);
    const template = this.eventTemplateRepo.create({
      name,
      description,
      createdBy: user
    });
    const savedTemplate = await this.eventTemplateRepo.save(template);
    const event = this.eventRepo.create({
      date: convertFromDateStringToDateTime(date).toJSDate(),
      template: savedTemplate,
      createdBy: user
    });
    const savedEvent = await this.eventRepo.save(event);

    return savedEvent;
  }

  async createEventFromTemplate(
    input: CreateEventFromTemplateInput,
    decoded: DecodedAuthToken
  ): Promise<Event> {
    const { templateId, date } = input;

    const user = await this.userService.validateUser(decoded.sub);
    const eventTemplate = await this.eventTemplateRepo.findOne({
      where: { id: templateId, createdBy: { id: user.id }, isActive: true }
    });
    if (!eventTemplate) {
      throw new NotFoundException('Event Template not found');
    }

    //TODO: Check if event already exists for the same date

    const event = this.eventRepo.create({
      date: convertFromDateStringToDateTime(date).toJSDate(),
      template: eventTemplate,
      createdBy: user
    });
    const savedEvent = await this.eventRepo.save(event);

    return savedEvent;
  }

  async publishEvent(eventId: number, decoded: DecodedAuthToken): Promise<Event> {
    const user = await this.userService.validateUser(decoded.sub);
    const event = await this.eventRepo.findOne({
      where: {
        id: eventId,
        createdBy: { id: user.id },
        status: EventStatus.Draft,
        availableTicketsQuantity: MoreThan(0),
        isActive: true
      }
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    event.status = EventStatus.Published;
    const updatedEvent = await this.eventRepo.save(event);

    return updatedEvent;
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepo.find({
      where: { status: In([EventStatus.Published, EventStatus.SoldOut]), isActive: true },
      relations: ['tickets']
    });
  }

  async incrementEventTicketQuantities(event: Event, savedTickets: Ticket[]): Promise<Event> {
    const originalTicketsQuantity = savedTickets.reduce((acc, t) => acc + t.originalQuantity, 0);
    event.originalTicketsQuantity += originalTicketsQuantity;
    event.availableTicketsQuantity += originalTicketsQuantity;
    const updatedEvent = await this.eventRepo.save(event);
    return updatedEvent;
  }

  async findOne(filter: Partial<Record<keyof Event, any>>): Promise<Event | null> {
    return this.eventRepo.findOne({ where: filter });
  }
}
