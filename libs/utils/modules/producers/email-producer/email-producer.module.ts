import { Module } from '@nestjs/common';
import { type ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { EMAIL_PRODUCER_DI_TOKENS } from './di-tokens';
import { EmailProducerService } from './email-producer.service';
import { EMAIL_QUEUE } from '@utils/constants/brokers/email.queue';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: EMAIL_PRODUCER_DI_TOKENS.EMAIL_BROKER_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService): ClientOptions => {
          const host = config.get<string>('RABBITMQ_HOST');
          const port = config.get<string>('RABBITMQ_PORT');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${host}:${port}`],
              queue: EMAIL_QUEUE,
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
      provide: EMAIL_PRODUCER_DI_TOKENS.EMAIL_PRODUCER,
      useClass: EmailProducerService,
    },
  ],
  exports: [EMAIL_PRODUCER_DI_TOKENS.EMAIL_PRODUCER],
})
export class EmailProducerModule {}
