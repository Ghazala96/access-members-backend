import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { join } from 'path';

import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { OrderModule } from './modules/order/order.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { VAccountModule } from './modules/vaccount/vaccount.module';
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
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            originalError: error.extensions?.originalError
          }
        };
      }
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
    CacheModule.register({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    VAccountModule,
    EventModule,
    TicketModule,
    OrderModule,
    TransactionModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidNonWhitelisted: true
      })
    }
  ]
})
export class AppModule {}
