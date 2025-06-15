import { Injectable, Inject } from '@nestjs/common';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { GetWeatherResponse } from './responses/get-weather.response';
import type { IWeatherService } from './interfaces/weather.service.interface';
import type { IWeatherMapper } from '@weather/interfaces/weather.mapper.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(DI_TOKENS.WEATHER_API_CLIENT)
    private readonly weatherApiClient: IWeatherApiClient,
    @Inject(DI_TOKENS.WEATHER_MAPPER)
    private readonly weatherMapper: IWeatherMapper,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const data = await this.weatherApiClient.getWeatherData(city);

    return this.weatherMapper.mapToGetWeatherResponse(data);
  }
}
