import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventTemplate } from './entities/event-template.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventTemplate, Event])],
  providers: []
})
export class EventModule {}
