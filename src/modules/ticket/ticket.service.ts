import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';

import { Ticket } from './entities/ticket.entity';
import { Event } from '../event/entities/event.entity';
import { AddTicketInput } from './dtos/add-ticket.input';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { DecodedAuthToken } from '../auth/auth.types';
import { TicketLedger } from './entities/ticket-ledger.entity';
import { TicketPriceHistory } from './entities/ticket-price-history.entity';
import { TicketLedgerOperation, TicketStatus } from './ticket.constants';
import { EventStatus } from '../event/event.constants';
import { PurchaseItem } from '../purchase-item/entities/purchase-item.entity';

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

  async addTickets(
    eventId: number,
    inputTickets: AddTicketInput[],
    decoded: DecodedAuthToken
  ): Promise<Ticket[]> {
    const user = await this.userService.validateUser(decoded.sub);
    const event = await this.eventService.findOne({
      where: {
        id: eventId,
        createdBy: { id: user.id },
        status: In([EventStatus.Draft, EventStatus.ReadyForListing])
      }
    });
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    await this.validateDuplicateTicketTypes(eventId, inputTickets);
    const tickets = inputTickets.map((ticket) => {
      return this.ticketRepo.create({
        event,
        type: ticket.type,
        price: ticket.price.toFixed(2),
        originalQuantity: ticket.quantity,
        availableQuantity: ticket.quantity
      });
    });
    const savedTickets = await this.ticketRepo.save(tickets);
    await this.createTicketRelatedEntries(event, savedTickets);
    await this.eventService.updateEventOnTicketAddition(event, savedTickets);
    const updatedTickets = await this.ticketRepo.find({
      where: { id: In(savedTickets.map((t) => t.id)) }
    });

    return updatedTickets;
  }

  private async validateDuplicateTicketTypes(eventId: number, inputTickets: AddTicketInput[]) {
    const existingTickets = await this.ticketRepo.find({
      where: { event: { id: eventId } }
    });
    const existingTypes = new Set(existingTickets.map((t) => t.type.toLowerCase()));
    inputTickets.forEach((ticket) => {
      if (existingTypes.has(ticket.type.toLowerCase())) {
        throw new ConflictException(`Ticket type '${ticket.type}' already exists for this event`);
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

  async holdTickets(event: Event, ticketItems: PurchaseItem[]) {
    const tickets = event.tickets;
    const itemsMap = new Map(ticketItems.map((item) => [item.itemId, item]));
    let totalTicketQuantity = 0;
    const ticketLedgerEntries: TicketLedger[] = [];

    for (const ticket of tickets) {
      const item = itemsMap.get(ticket.id);
      if (!item) {
        continue;
      }

      const ticketLedgerEntry = this.ticketLedgerRepo.create({
        event,
        ticket,
        previousBalance: ticket.availableQuantity,
        balanceChange: item.quantity,
        operation: TicketLedgerOperation.Decrease,
        newBalance: ticket.availableQuantity - item.quantity
      });
      ticketLedgerEntries.push(ticketLedgerEntry);

      ticket.availableQuantity -= item.quantity;
      totalTicketQuantity += item.quantity;

      if (ticket.availableQuantity < 0) {
        throw new ConflictException(`Ticket quantity exceeds available quantity`);
      }
      if (ticket.availableQuantity === 0) {
        ticket.status = TicketStatus.SoldOut;
      }
    }

    const saveTicketsPromise = this.ticketRepo.save(tickets);
    const saveLedgerPromise = this.ticketLedgerRepo.save(ticketLedgerEntries);
    const holdEventTicketsPromise = this.eventService.holdTickets(event, totalTicketQuantity);

    return Promise.all([saveTicketsPromise, saveLedgerPromise, holdEventTicketsPromise]);
  }

  async findOne(options: FindOneOptions<Ticket>): Promise<Ticket> {
    return this.ticketRepo.findOne(options);
  }
}
