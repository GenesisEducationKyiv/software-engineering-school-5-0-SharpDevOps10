import { Injectable, Inject } from '@nestjs/common';
import { GetWeatherResponse } from '../../responses/get-weather.response';
import type { IWeatherService } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IWeatherHandler } from '@weather/application/handlers/interfaces/weather-handler.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_HANDLER)
    private readonly handler: IWeatherHandler,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    return this.handler.handle(city);
  }
}
