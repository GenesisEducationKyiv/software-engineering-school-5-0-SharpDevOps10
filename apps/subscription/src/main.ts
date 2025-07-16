import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SubscriptionConfigService } from './modules/config/subscription-config.service';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from '@utils/filters/rpc-exception.filter';

async function bootstrap (): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(SubscriptionConfigService);
  const port = configService.getPort();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: 'subscription',
      protoPath: 'libs/proto/subscription.proto',
    },
  });

  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();

  Logger.log(`Subscription Service is running on port ${port}`);
}
bootstrap();
