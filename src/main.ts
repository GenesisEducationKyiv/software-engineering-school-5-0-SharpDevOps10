import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app/app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
dotenv.config();

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
}
bootstrap();
