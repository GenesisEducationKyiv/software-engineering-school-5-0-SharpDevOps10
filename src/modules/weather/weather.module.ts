import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiModule } from '@weather-api/weather-api.module';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { WeatherMapper } from '@weather/mappers/weather.mapper';

@Module({
  imports: [WeatherApiModule],
  controllers: [WeatherController],
  providers: [
    {
      provide: DI_TOKENS.WEATHER_SERVICE,
      useClass: WeatherService,
    },
    {
      provide: DI_TOKENS.WEATHER_MAPPER,
      useClass: WeatherMapper,
    },
  ],
  exports: [WeatherApiModule, DI_TOKENS.WEATHER_SERVICE],
})
export class WeatherModule {}
