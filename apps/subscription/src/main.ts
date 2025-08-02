import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SubscriptionConfigService } from './modules/config/subscription-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from '@utils/filters/rpc-exception.filter';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { QUEUES } from '@utils/constants/brokers/queues';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(SubscriptionConfigService);

  const grpcPort = configService.getPort();
  const rmqHost = configService.getRabbitMqHost();
  const rmqPort = configService.getRabbitMqPort();

  const logger = app.get<LoggerServiceInterface>(LOGGER_DI_TOKENS.LOGGER_SERVICE);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${grpcPort}`,
      package: GRPC_PACKAGES.SUBSCRIPTION,
      protoPath: GRPC_PROTO_PATH.SUBSCRIPTION,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rmqHost}:${rmqPort}`],
      queue: QUEUES.SUBSCRIPTION_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.useGlobalFilters(new ExceptionFilter());
  await app.init();

  await app.startAllMicroservices();

  logger.info(`Subscription Service is running (gRPC: ${grpcPort}, RMQ queue: ${QUEUES.SUBSCRIPTION_QUEUE})`);
}
bootstrap();
