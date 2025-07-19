import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { NotificationConfigModule } from '../../config/notification-config.module';
import { NotificationConfigService } from '../../config/notification-config.service';
import { NOTIFICATION_DI_TOKENS } from '../../notification/di-tokens';
import { WeatherClientService } from './weather-client.service';

@Module({
  imports: [
    NotificationConfigModule,
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.WEATHER_PACKAGE,
        imports: [NotificationConfigModule],
        useFactory: (config: NotificationConfigService): ClientOptions => {
          const host = config.getWeatherClientHost();
          const port = config.getWeatherClientPort();

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: GRPC_PACKAGES.WEATHER,
              protoPath: GRPC_PROTO_PATH.WEATHER,
            },
          };
        },
        inject: [NotificationConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: NOTIFICATION_DI_TOKENS.WEATHER_CLIENT,
      useClass: WeatherClientService,
    },
  ],
  exports: [
    NOTIFICATION_DI_TOKENS.WEATHER_CLIENT,
  ],
})
export class WeatherClientModule {}
