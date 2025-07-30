import { Module } from '@nestjs/common';
import { WeatherApiClient } from './client/weather-api.client';
import { WEATHER_DI_TOKENS } from '../weather/constants/di-tokens';
import { WeatherApiMapper } from './mappers/weather-api.mapper';
import { WeatherConfigModule } from '../config/weather-config.module';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  imports: [WeatherConfigModule, LoggerModule],
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
