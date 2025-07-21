import { Module } from '@nestjs/common';
import { ClientsModule, Transport, type ClientOptions } from '@nestjs/microservices';
import { CLIENTS_PACKAGES } from '../clients.packages';
import { WeatherClientService } from './weather-client.service';
import { GRPC_PACKAGES } from '@micro-services/packages/grpc-packages.constants';
import { GRPC_PROTO_PATH } from '@micro-services/proto-path/grpc-proto-path.constants';
import { GateWayConfigModule } from '../../config/gate-way-config.module';
import { GateWayConfigService } from '../../config/gate-way-config.service';
import { GATEWAY_CLIENT_DI_TOKENS } from '../di-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CLIENTS_PACKAGES.WEATHER_PACKAGE,
        imports: [GateWayConfigModule],
        useFactory: (config: GateWayConfigService): ClientOptions => {
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
        inject: [GateWayConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: GATEWAY_CLIENT_DI_TOKENS.WEATHER_CLIENT,
      useClass: WeatherClientService,
    },
  ],
  exports: [GATEWAY_CLIENT_DI_TOKENS.WEATHER_CLIENT],
})
export class WeatherClientModule {}
