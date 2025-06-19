import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiModule } from '@weather-api/weather-api.module';
import { WeatherMapper } from '@weather/mappers/weather.mapper';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

@Module({
  imports: [WeatherApiModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
      useClass: WeatherService,
    },
    {
      provide: WEATHER_DI_TOKENS.WEATHER_MAPPER,
      useClass: WeatherMapper,
    },
  ],
  exports: [WeatherApiModule, WEATHER_DI_TOKENS.WEATHER_SERVICE],
})
export class WeatherModule {}
