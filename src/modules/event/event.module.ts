import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventTemplate } from './entities/event-template.entity';
import { Event } from './entities/event.entity';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventTemplate, Event]), UserModule],
  providers: [EventResolver, EventService]
})
export class EventModule {}
