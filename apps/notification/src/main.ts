import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = app.get<LoggerServiceInterface>(LOGGER_DI_TOKENS.LOGGER_SERVICE);

  logger.info('Notification Service started with cron jobs only');
}
bootstrap();
