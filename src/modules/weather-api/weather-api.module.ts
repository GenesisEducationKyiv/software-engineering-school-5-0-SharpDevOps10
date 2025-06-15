import { Module } from '@nestjs/common';
import { WeatherApiClient } from './weather-api.client';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';

@Module({
  providers: [
    {
      provide: DI_TOKENS.WEATHER_API_CLIENT,
      useClass: WeatherApiClient,
    },
  ],
  exports: [DI_TOKENS.WEATHER_API_CLIENT],
})
export class WeatherApiModule {}
