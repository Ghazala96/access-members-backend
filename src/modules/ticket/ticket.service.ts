import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Ticket } from './entities/ticket.entity';
import { Event } from '../event/entities/event.entity';
import { CreateTicketInput } from './dtos/create-ticket.input';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { DecodedAuthToken } from '../auth/auth.types';
import { TicketLedger } from './entities/ticket-ledger.entity';
import { TicketPriceHistory } from './entities/ticket-price-history.entity';
import { TicketLedgerOperation } from './ticket.constants';
import { EventStatus } from '../event/event.constants';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketLedger) private readonly ticketLedgerRepo: Repository<TicketLedger>,
    @InjectRepository(TicketPriceHistory)
    private readonly ticketPriceHistoryRepo: Repository<TicketPriceHistory>,
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  async createTickets(
    eventId: number,
    inputs: CreateTicketInput[],
    decoded: DecodedAuthToken
  ): Promise<Ticket[]> {
    const user = await this.userService.validateUser(decoded.sub);
    const event = await this.eventService.findOne({
      id: eventId,
      createdBy: { id: user.id },
      status: EventStatus.Draft,
      isActive: true
    });
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    await this.validateDuplicateTicketTypes(eventId, inputs);
    const tickets = inputs.map((ticket) => {
      return this.ticketRepo.create({
        event,
        type: ticket.type,
        price: ticket.price,
        originalQuantity: ticket.quantity,
        availableQuantity: ticket.quantity
      });
    });
    const savedTickets = await this.ticketRepo.save(tickets);
    await this.createTicketRelatedEntries(event, savedTickets);
    await this.eventService.incrementEventTicketQuantities(event, savedTickets);
    const updatedTickets = await this.ticketRepo.find({
      where: { id: In(savedTickets.map((t) => t.id)), isActive: true }
    });

    return updatedTickets;
  }

  private async validateDuplicateTicketTypes(eventId: number, inputs: CreateTicketInput[]) {
    const existingTickets = await this.ticketRepo.find({
      where: { event: { id: eventId }, isActive: true }
    });
    const existingTypes = new Set(existingTickets.map((t) => t.type.toLowerCase()));
    inputs.forEach((input) => {
      if (existingTypes.has(input.type.toLowerCase())) {
        throw new ConflictException(`Ticket type '${input.type}' already exists for this event`);
      }
    });
  }

  private async createTicketRelatedEntries(event: Event, tickets: Ticket[]): Promise<void> {
    const priceHistories = [];
    const ticketLedgers = [];
    tickets.forEach((ticket) => {
      ticketLedgers.push(this.createInitialTicketLedgerEntry(event, ticket));
      priceHistories.push(this.createInitialPriceHistoryEntry(ticket));
    });
    await Promise.all([
      this.ticketLedgerRepo.save(ticketLedgers),
      this.ticketPriceHistoryRepo.save(priceHistories)
    ]);
  }

  private createInitialTicketLedgerEntry(event: Event, ticket: Ticket): TicketLedger {
    return this.ticketLedgerRepo.create({
      event,
      ticket,
      previousBalance: 0,
      balanceChange: ticket.originalQuantity,
      operation: TicketLedgerOperation.Increase,
      newBalance: ticket.originalQuantity
    });
  }

  private createInitialPriceHistoryEntry(ticket: Ticket): TicketPriceHistory {
    return this.ticketPriceHistoryRepo.create({
      ticket,
      price: ticket.price,
      validFrom: ticket.createdAt
    });
  }
}
