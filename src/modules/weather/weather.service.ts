import { Injectable, Inject } from '@nestjs/common';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { GetWeatherResponse } from './responses/get-weather.response';
import type { IWeatherService } from './interfaces/weather.service.interface';
import type { IWeatherMapper } from '@weather/interfaces/weather.mapper.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_API_CLIENT)
    private readonly weatherApiClient: IWeatherApiClient,
    @Inject(WEATHER_DI_TOKENS.WEATHER_MAPPER)
    private readonly weatherMapper: IWeatherMapper,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const data = await this.weatherApiClient.getWeatherData(city);

    return this.weatherMapper.mapToGetWeatherResponse(data);
  }
}
