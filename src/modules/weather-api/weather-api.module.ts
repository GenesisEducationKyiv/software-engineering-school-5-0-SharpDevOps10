import { Module } from '@nestjs/common';
import { WeatherApiClient } from './weather-api.client';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

@Module({
  providers: [
    {
      provide: WEATHER_DI_TOKENS.WEATHER_API_CLIENT,
      useClass: WeatherApiClient,
    },
  ],
  exports: [WEATHER_DI_TOKENS.WEATHER_API_CLIENT],
})
export class WeatherApiModule {}
