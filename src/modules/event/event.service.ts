import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, MoreThan, Repository } from 'typeorm';

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

  async createEvent(inputEvent: CreateEventInput, decoded: DecodedAuthToken): Promise<Event> {
    const { name, description, date } = inputEvent;

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
    templateId: number,
    inputEvent: CreateEventFromTemplateInput,
    decoded: DecodedAuthToken
  ): Promise<Event> {
    const user = await this.userService.validateUser(decoded.sub);
    const eventTemplate = await this.eventTemplateRepo.findOne({
      where: { id: templateId, createdBy: { id: user.id } }
    });
    if (!eventTemplate) {
      throw new NotFoundException('Event Template not found');
    }

    //TODO: Check if event already exists for the same date

    const event = this.eventRepo.create({
      date: convertFromDateStringToDateTime(inputEvent.date).toJSDate(),
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
        availableTicketsQuantity: MoreThan(0)
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
      where: { status: In([EventStatus.Published, EventStatus.SoldOut]) },
      relations: ['tickets']
    });
  }

  async updateEventOnTicketAddition(event: Event, tickets: Ticket[]): Promise<Event> {
    const originalTicketsQuantity = tickets.reduce((acc, t) => acc + t.originalQuantity, 0);
    event.originalTicketsQuantity += originalTicketsQuantity;
    event.availableTicketsQuantity += originalTicketsQuantity;
    if (event.status === EventStatus.Draft) {
      event.status = EventStatus.ReadyForListing;
    }
    return this.eventRepo.save(event);
  }

  async holdTickets(event: Event, quantity: number): Promise<Event> {
    event.availableTicketsQuantity -= quantity;
    if (event.availableTicketsQuantity < 0) {
      throw new ConflictException(`Event tickets quantity exceeds available quantity`);
    }
    if (event.availableTicketsQuantity === 0) {
      event.status = EventStatus.SoldOut;
    }

    return this.eventRepo.save(event);
  }

  async findOne(options: FindOneOptions<Event>): Promise<Event | null> {
    return this.eventRepo.findOne(options);
  }
}
