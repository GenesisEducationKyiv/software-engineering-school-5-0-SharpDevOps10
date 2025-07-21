import { Module } from '@nestjs/common';
import { WeatherClientModule } from '../clients/weather-client/weather-client.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WEATHER_DI_TOKENS } from './di-tokens';

@Module({
  imports: [
    WeatherClientModule,
  ],
  controllers: [WeatherController],
  providers: [
    {
      provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
      useClass: WeatherService,
    },
  ],
})
export class WeatherModule {}
