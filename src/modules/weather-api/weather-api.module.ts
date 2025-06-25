import { Module } from '@nestjs/common';
import { WeatherApiClient } from './weather-api.client';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { WeatherApiMapper } from '@weather-api/mappers/weather-api.mapper';
import { ConfigModule } from '@modules/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: WEATHER_DI_TOKENS.WEATHER_API_CLIENT,
      useClass: WeatherApiClient,
    },
    {
      provide: WEATHER_DI_TOKENS.WEATHER_MAPPER,
      useClass: WeatherApiMapper,
    },
  ],
  exports: [WEATHER_DI_TOKENS.WEATHER_API_CLIENT],
})
export class WeatherApiModule {}
