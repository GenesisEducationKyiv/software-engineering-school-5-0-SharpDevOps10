import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { EmailConfigService } from './modules/config/email-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from '@utils/filters/rpc-exception.filter';
dotenv.config();

async function bootstrap (): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(EmailConfigService);
  const port = configService.getPort();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: 'email',
      protoPath: 'libs/proto/email.proto',
    },
  });

  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();

  Logger.log(`Email Service is running on port ${port}`);
}
bootstrap();
