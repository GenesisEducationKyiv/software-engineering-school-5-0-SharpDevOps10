import { WEATHER_DI_TOKENS } from '@modules/weather/di-tokens';
import { Module } from '@nestjs/common';
import { VisualCrossingClient } from '@visual-crossing-api/visual-crossing.client';
import { VisualCrossingMapper } from '@visual-crossing-api/mappers/visual-crossing.mapper';
import { ConfigModule } from '@modules/config/config.module';

@Module({
  imports: [ConfigModule],
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
