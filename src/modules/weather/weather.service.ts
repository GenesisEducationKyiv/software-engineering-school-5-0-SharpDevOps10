import { Injectable, Inject } from '@nestjs/common';
import { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { GetWeatherResponse } from './responses/get-weather.response';
import type { IWeatherService } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_API_CLIENT)
    private readonly weatherApiClient: IWeatherApiClient,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    return await this.weatherApiClient.getWeatherData(city);
  }
}
