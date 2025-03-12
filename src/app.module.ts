import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { OrderModule } from './modules/order/order.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { VaccountModule } from './modules/vaccount/vaccount.module';
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/user/entities/role.entity';
import { VAccount } from './modules/vaccount/entities/vaccount.entity';
import { VAccountLedger } from './modules/vaccount/entities/vaccount-ledger.entity';
import { Event } from './modules/event/entities/event.entity';
import { EventTemplate } from './modules/event/entities/event-template.entity';
import { Ticket } from './modules/ticket/entities/ticket.entity';
import { TicketLedger } from './modules/ticket/entities/ticket-ledger.entity';
import { TicketPriceHistory } from './modules/ticket/entities/ticket-price-history.entity';
import { Order } from './modules/order/entities/order.entity';
import { OrderItem } from './modules/order/entities/order-item.entity';
import { Transaction } from './modules/transaction/entities/transaction.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = configService.get<string>('ENV', 'dev').toLowerCase();
        const isDev = env === 'dev';
        const isQa = env === 'qa';

        return {
          type: configService.get<'mysql' | 'postgres'>('DB_TYPE', 'mysql'),
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [
            User,
            Role,
            VAccount,
            VAccountLedger,
            Event,
            EventTemplate,
            Ticket,
            TicketLedger,
            TicketPriceHistory,
            Order,
            OrderItem,
            Transaction
          ],
          synchronize: isDev || isQa,
          logging: isDev || isQa
        };
      }
    }),
    UserModule,
    VaccountModule,
    EventModule,
    TicketModule,
    OrderModule,
    TransactionModule
  ]
})
export class AppModule {}
