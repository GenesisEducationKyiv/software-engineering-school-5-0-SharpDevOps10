import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { EmailConfigService } from './modules/config/email-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@utils/constants/brokers/queues';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EmailConfigService);
  const host = configService.getRabbitMqHost();
  const rmgPort = configService.getRabbitMqPort();
  const port = configService.getPort();

  const logger = app.get<LoggerServiceInterface>(LOGGER_DI_TOKENS.LOGGER_SERVICE);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${host}:${rmgPort}`],
      queue: QUEUES.EMAIL_QUEUE,
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  await app.listen(port);
  logger.info(`Email Service is listening to RabbitMQ queue: ${QUEUES.EMAIL_QUEUE}, ${rmgPort}`);
}
bootstrap();
