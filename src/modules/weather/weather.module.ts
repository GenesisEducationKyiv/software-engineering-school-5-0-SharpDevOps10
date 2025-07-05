import { Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiModule } from '@weather-api/weather-api.module';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { VisualCrossingModule } from '@visual-crossing-api/visual-crossing.module';
import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { VisualCrossingHandler } from '@weather/handlers/visual-crossing.handler';
import { WeatherHandlerFactory } from '@weather/factories/weather-handler.factory';
import { IWeatherHandler } from '@weather/interfaces/weather-handler.interface';
import { ConfigModule } from '@config/config.module';
import { RedisModule } from '@modules/redis/redis.module';
import { CachedWeatherService } from '@weather/services/cached-weather.service';

@Module({
  imports: [
    WeatherApiModule,
    VisualCrossingModule,
    ConfigModule,
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
