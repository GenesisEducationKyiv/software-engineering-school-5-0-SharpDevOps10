import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { WEATHER_DI_TOKENS } from '@modules/weather/di-tokens';
import { IWeatherMapper } from '@weather-api/interfaces/weather.mapper.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { plainToInstance } from 'class-transformer';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import type { WeatherApiErrorResponse } from '@weather-api/responses/weather-api.error-response.interface';

@Injectable()
export class WeatherApiClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_MAPPER)
    private readonly mapper: IWeatherMapper,
  ) {}

  private readonly apiKey = process.env.WEATHER_API_KEY;
  private readonly baseUrl = process.env.WEATHER_API_BASE_URL;

  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    let response: Response;

    try {
      response = await fetch(url);
    } catch (err) {
      throw new HttpException(
        `Cannot reach Weather API: ${err.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const body = await response.json();
    if (!response.ok) this.handleApiError(response.status, body, city);

    const data = plainToInstance(WeatherApiResponse, body);

    return this.mapper.mapToGetWeatherResponse(data);
  }

  private handleApiError (status: number, body: WeatherApiErrorResponse, city: string): never {
    const CITY_NOT_FOUND_CODE = 1006;
    const errorCode = body?.error?.code;
    const message = body?.error?.message ?? 'Unknown error';

    if (errorCode === CITY_NOT_FOUND_CODE) throw new NotFoundException(`City not found: ${city}`);

    throw new HttpException(
      `Weather API error ${status}: ${message}`,
      status,
    );
  }
}
