import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { WeatherConfigService } from './modules/config/weather-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from '@utils/filters/rpc-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap (): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(WeatherConfigService);
  const port = configService.getPort();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: 'weather',
      protoPath: 'libs/proto/weather.proto',
    },
  });

  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();

  Logger.log(`Weather Service is running on port ${port}`);
}
bootstrap();
