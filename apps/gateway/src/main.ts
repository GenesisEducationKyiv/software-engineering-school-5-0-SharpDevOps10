import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { GateWayConfigService } from './modules/config/gate-way-config.service';
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter());

  const logger = app.get<LoggerServiceInterface>(LOGGER_DI_TOKENS.LOGGER_SERVICE);

  const configService = app.get(GateWayConfigService);
  const port = configService.getPort();

  await app.listen(port);

  logger.info(`Gateway is running on port ${port}`);
}
bootstrap();
