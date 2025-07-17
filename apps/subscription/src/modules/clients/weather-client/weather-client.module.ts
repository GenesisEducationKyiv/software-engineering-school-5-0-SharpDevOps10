import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { SubscriptionConfigService } from '../../config/subscription-config.service';
import { SUBSCRIPTION_DI_TOKENS } from '../../subscription/constants/di-tokens';
import { SubscriptionConfigModule } from '../../config/subscription-config.module';
import { WeatherClientService } from './weather-client.service';

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
              package: 'weather',
              protoPath: 'libs/proto/weather.proto',
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
