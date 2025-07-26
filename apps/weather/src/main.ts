import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { WeatherConfigService } from './modules/config/weather-config.service';
import { Logger } from '@nestjs/common';

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(WeatherConfigService);
  const port = configService.getPort();


  await app.listen(port);
  Logger.log(`Weather HTTP Service is running on port ${port}`);
}
bootstrap();
