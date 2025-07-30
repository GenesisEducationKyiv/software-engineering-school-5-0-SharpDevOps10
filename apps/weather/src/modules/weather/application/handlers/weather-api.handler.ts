import { Inject, Injectable } from '@nestjs/common';
import { BaseWeatherHandler } from './base-weather.handler';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class WeatherApiHandler extends BaseWeatherHandler {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_API_CLIENT)
    private readonly client: IWeatherApiClient,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    logger: LoggerServiceInterface,
  ) {
    super(logger);
    this.logger.setContext(WeatherApiHandler.name);
  }

  async handle (city: string): Promise<GetWeatherResponse> {
    try {
      this.logger.info(`WeatherApi returned weather for "${city}"`);

      return await this.client.getWeatherData(city);
    } catch (e) {
      this.logger.warn(`WeatherApi failed for "${city}": ${e.message}`);

      return super.handle(city, e);
    }
  }

}
