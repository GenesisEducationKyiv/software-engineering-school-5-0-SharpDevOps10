import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GateWayConfigService } from './modules/config/gate-way-config.service';
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter());

  const configService = app.get(GateWayConfigService);
  const port = configService.getPort();

  await app.listen(port);

  Logger.log(`Gateway is running on port ${port}`);
}
bootstrap();
