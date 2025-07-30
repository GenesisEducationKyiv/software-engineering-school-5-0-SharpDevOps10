import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import { EmailConfigService } from './modules/config/email-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@utils/constants/brokers/queues';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EmailConfigService);
  const host = configService.getRabbitMqHost();
  const port = configService.getRabbitMqPort();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${host}:${port}`],
      queue: QUEUES.EMAIL_QUEUE,
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`Email Service is listening to RabbitMQ queue: ${QUEUES.EMAIL_QUEUE}, ${port}`);
}
bootstrap();
