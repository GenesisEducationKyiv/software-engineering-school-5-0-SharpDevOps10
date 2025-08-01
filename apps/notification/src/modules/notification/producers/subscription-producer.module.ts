import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUES } from '@utils/constants/brokers/queues';
import { SUBSCRIPTION__PRODUCER_DI_TOKENS } from './di-tokens';
import { SubscriptionProducerService } from './subscription-producer.service';
import { NOTIFICATION_DI_TOKENS } from '../di-tokens';
import { LoggerModule } from '@utils/modules/logger/logger.module';
import { NotificationConfigModule } from '../../config/notification-config.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NotificationConfigModule,
    ClientsModule.registerAsync([
      {
        name: SUBSCRIPTION__PRODUCER_DI_TOKENS.NOTIFICATION_BROKER_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService): ClientOptions => {
          const host = config.get<string>('RABBITMQ_HOST');
          const port = config.get<string>('RABBITMQ_PORT');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${host}:${port}`],
              queue: QUEUES.SUBSCRIPTION_QUEUE,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: NOTIFICATION_DI_TOKENS.SUBSCRIPTION_PRODUCER,
      useClass: SubscriptionProducerService,
    },
  ],
  exports: [NOTIFICATION_DI_TOKENS.SUBSCRIPTION_PRODUCER],
})
export class SubscriptionProducerModule {}
