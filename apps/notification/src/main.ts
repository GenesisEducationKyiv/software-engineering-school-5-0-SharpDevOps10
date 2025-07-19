import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap (): Promise<void> {
  await NestFactory.createApplicationContext(AppModule);

  Logger.log('Notification Service started with cron jobs only');
}
bootstrap();
