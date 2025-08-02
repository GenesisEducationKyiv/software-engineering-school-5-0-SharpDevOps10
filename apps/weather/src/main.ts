import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { WeatherConfigService } from './modules/config/weather-config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from '@utils/filters/rpc-exception.filter';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

async function bootstrap (): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(WeatherConfigService);
  const port = configService.getPort();

  const logger = appContext.get<LoggerServiceInterface>(LOGGER_DI_TOKENS.LOGGER_SERVICE);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: GRPC_PACKAGES.WEATHER,
      protoPath: GRPC_PROTO_PATH.WEATHER,
    },
  });

  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();

  logger.info(`Weather Service is running on port ${port}`);
}
bootstrap();
