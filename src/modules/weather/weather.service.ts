import { Injectable, Inject } from '@nestjs/common';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { GetWeatherResponse } from './responses/get-weather.response';
import type { IWeatherService } from './interfaces/weather.service.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(DI_TOKENS.WEATHER_API_CLIENT)
    private readonly weatherApiClient: IWeatherApiClient,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const data = await this.weatherApiClient.getWeatherData(city);

    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
