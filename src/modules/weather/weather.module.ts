import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiModule } from '@weather-api/weather-api.module';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { VisualCrossingModule } from '@visual-crossing-api/visual-crossing.module';

@Module({
  imports: [WeatherApiModule, VisualCrossingModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
      useClass: WeatherService,
    },
  ],
  exports: [WeatherApiModule, WEATHER_DI_TOKENS.WEATHER_SERVICE],
})
export class WeatherModule {}
