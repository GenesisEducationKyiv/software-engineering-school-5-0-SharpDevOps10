import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { EmailConfigService } from './modules/config/email-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EMAIL_QUEUE } from '@utils/constants/brokers/email.queue';
dotenv.config();

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EmailConfigService);
  const host = configService.getRabbitMqHost();
  const port = configService.getRabbitMqPort();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${host}:${port}`],
      queue: EMAIL_QUEUE,
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  Logger.log(`Email Service is listening to RabbitMQ queue: ${EMAIL_QUEUE}, ${port}`);
}
bootstrap();
