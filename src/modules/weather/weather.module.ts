import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiModule } from '@weather-api/weather-api.module';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { VisualCrossingModule } from '@visual-crossing-api/visual-crossing.module';
import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { VisualCrossingHandler } from '@weather/handlers/visual-crossing.handler';
import { WeatherHandlerFactory } from '@weather/factories/weather-handler.factory';
import { IWeatherHandler } from '@weather/interfaces/weather-handler.interface';

@Module({
  imports: [WeatherApiModule, VisualCrossingModule],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherApiHandler,
    VisualCrossingHandler,
    WeatherHandlerFactory,
    {
      provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
      useClass: WeatherService,
    },
    {
      provide: WEATHER_DI_TOKENS.WEATHER_HANDLER,
      useFactory: (
        factory: WeatherHandlerFactory,
        weatherApi: WeatherApiHandler,
        visualCrossing: VisualCrossingHandler,
      ): IWeatherHandler => {
        return factory.create(weatherApi, visualCrossing);
      },
      inject: [WeatherHandlerFactory, WeatherApiHandler, VisualCrossingHandler],
    },
  ],
  exports: [WeatherApiModule, WEATHER_DI_TOKENS.WEATHER_SERVICE],
})
export class WeatherModule {}
