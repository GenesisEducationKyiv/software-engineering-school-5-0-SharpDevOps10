import { Module } from '@nestjs/common';
import { WeatherController } from './presentation/weather.controller';
import { VisualCrossingModule } from '../visual-crossing-api/visual-crossing.module';
import { WeatherApiModule } from '../weather-api/weather-api.module';
import { WeatherConfigModule } from '../config/weather-config.module';
import { RedisModule } from '@utils/modules/redis/redis.module';
import { WeatherService } from './application/services/weather.service';
import { WeatherApiHandler } from './application/handlers/weather-api.handler';
import { VisualCrossingHandler } from './application/handlers/visual-crossing.handler';
import { WEATHER_DI_TOKENS } from './constants/di-tokens';
import { WeatherHandlerFactory } from './application/factories/weather-handler.factory';
import { CachedWeatherService } from './application/services/cached-weather.service';
import { IWeatherHandler } from './application/handlers/interfaces/weather-handler.interface';

@Module({
  imports: [
    WeatherApiModule,
    VisualCrossingModule,
    WeatherConfigModule,
    RedisModule,
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherApiHandler,
    VisualCrossingHandler,
    WeatherHandlerFactory,
    {
      provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
      useClass: CachedWeatherService,
    },
    {
      provide: WEATHER_DI_TOKENS.BASE_WEATHER_SERVICE,
      useClass: WeatherService,
    },
    {
      provide: WEATHER_DI_TOKENS.WEATHER_HANDLER,
      useFactory: (factory: WeatherHandlerFactory): IWeatherHandler => {
        return factory.createChain();
      },
      inject: [WeatherHandlerFactory],
    },
  ],
  exports: [
    WeatherApiModule,
    WEATHER_DI_TOKENS.WEATHER_SERVICE,
    WEATHER_DI_TOKENS.BASE_WEATHER_SERVICE,
  ],
})
export class WeatherModule {}
