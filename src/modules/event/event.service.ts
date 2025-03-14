import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { convertFromDateStringToDateTime } from 'src/common/utils';
import { Event } from './entities/event.entity';
import { EventTemplate } from './entities/event-template.entity';
import { CreateEventInput } from './dtos/create-event.input';
import { DecodedAuthToken } from '../auth/auth.types';
import { UserService } from '../user/user.service';
import { CreateEventFromTemplateInput } from './dtos/create-event-from-template.input';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventTemplate) private readonly eventTemplateRepo: Repository<EventTemplate>,
    private readonly userService: UserService
  ) {}

  async createEvent(input: CreateEventInput, decoded: DecodedAuthToken): Promise<Event> {
    const { name, description, date } = input;

    const user = await this.userService.findById(decoded.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    const user = await this.userService.findById(decoded.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const eventTemplate = await this.eventTemplateRepo.findOne({
      where: { id: templateId, createdBy: { id: user.id } }
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
}
