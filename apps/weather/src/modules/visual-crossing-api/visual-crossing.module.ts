import { Module } from '@nestjs/common';
import { WeatherConfigModule } from '../config/weather-config.module';
import { WEATHER_DI_TOKENS } from '../weather/constants/di-tokens';
import { VisualCrossingClient } from './client/visual-crossing.client';
import { VisualCrossingMapper } from './mappers/visual-crossing.mapper';
import { LoggerModule } from '@utils/modules/logger/logger.module';

@Module({
  imports: [WeatherConfigModule, LoggerModule],
  providers: [
    {
      provide: WEATHER_DI_TOKENS.VISUAL_CROSSING_CLIENT,
      useClass: VisualCrossingClient,
    },
    {
      provide: WEATHER_DI_TOKENS.VISUAL_CROSSING_MAPPER,
      useClass: VisualCrossingMapper,
    },
  ],
  exports: [WEATHER_DI_TOKENS.VISUAL_CROSSING_CLIENT],
})
export class VisualCrossingModule {}
