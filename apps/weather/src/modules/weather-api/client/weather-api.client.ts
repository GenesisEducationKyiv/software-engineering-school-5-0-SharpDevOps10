import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WEATHER_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { IWeatherConfigService } from '../../config/interfaces/weather-config.service.interface';
import { WeatherApiErrorResponse } from '../responses/weather-api.error-response.interface';
import { WEATHER_DI_TOKENS } from '../../weather/constants/di-tokens';
import { IWeatherApiClient } from '../../weather/application/interfaces/weather-api.interface';
import { IWeatherMapper } from './interfaces/weather.mapper.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { WeatherApiResponse } from '../responses/weather-api.response';
import { LogResponseToFile } from '@utils/decorators/log-response-to-file.decorator';
import {
  InternalRpcException,
  NotFoundRpcException,
  UnavailableException,
} from '@exceptions/grpc-exceptions';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class WeatherApiClient implements IWeatherApiClient {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_MAPPER)
    private readonly mapper: IWeatherMapper,

    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly config: IWeatherConfigService,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @LogResponseToFile('weatherapi.com')
  async getWeatherData (city: string): Promise<GetWeatherResponse> {
    const apiKey = this.config.getWeatherApiKey();
    const baseUrl = this.config.getWeatherApiBaseUrl();

    const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(city)}`;
    let response: Response;

    try {
      response = await fetch(url);
    } catch (err) {
      this.logger.error(`Network error while fetching weather for ${city}`, {
        context: this.constructor.name,
        method: this.getWeatherData.name,
        error: err.message,
      });
      throw new UnavailableException(`Cannot reach Weather API: ${err.message}`);
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

    if (errorCode === CITY_NOT_FOUND_CODE) {
      this.logger.warn(`City not found: ${city}`, {
        context: this.constructor.name,
        method: this.getWeatherData.name,
      });
      throw new NotFoundRpcException(`City not found: ${city}`);
    }

    this.logger.error(`Weather API error ${status} for ${city}}`, {
      context: this.constructor.name,
      method: this.getWeatherData.name,
      error: message,
    });
    throw new InternalRpcException(`Weather API error ${status}: ${message}`);
  }
}
