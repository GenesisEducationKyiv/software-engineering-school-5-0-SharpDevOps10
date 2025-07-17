import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { SubscriptionConfigService } from '../../config/subscription-config.service';
import { SUBSCRIPTION_DI_TOKENS } from '../../subscription/constants/di-tokens';
import { SubscriptionConfigModule } from '../../config/subscription-config.module';
import { WeatherClientService } from './weather-client.service';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.WEATHER_PACKAGE,
        imports: [SubscriptionConfigModule],
        useFactory: (config: SubscriptionConfigService): ClientOptions => {
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
        inject: [SubscriptionConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: SUBSCRIPTION_DI_TOKENS.WEATHER_CLIENT,
      useClass: WeatherClientService,
    },
  ],
  exports: [SUBSCRIPTION_DI_TOKENS.WEATHER_CLIENT],
})
export class WeatherClientModule {}
