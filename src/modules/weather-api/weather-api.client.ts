import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { WEATHER_DI_TOKENS } from '@modules/weather/di-tokens';
import { IWeatherMapper } from '@weather-api/interfaces/weather.mapper.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { plainToInstance } from 'class-transformer';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import type { WeatherApiErrorResponse } from '@weather-api/responses/weather-api.error-response.interface';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';
import { IConfigService } from '@modules/config/config.service.interface';
import { LogResponseToFile } from '@utils/decorators/log-response-to-file.decorator';

@Injectable()
export class WeatherApiClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_MAPPER)
    private readonly mapper: IWeatherMapper,
    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly config: IConfigService,
  ) {}

  @LogResponseToFile('weatherapi.com')
  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const apiKey = this.config.getWeatherApiKey();
    const baseUrl = this.config.getWeatherApiBaseUrl();

    const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(city)}`;
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
