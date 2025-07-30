import { Inject, Injectable } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { BaseWeatherHandler } from './base-weather.handler';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class VisualCrossingHandler extends BaseWeatherHandler {
  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_CLIENT)
    private readonly client: IWeatherApiClient,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    logger: LoggerServiceInterface,
  ) {
    super(logger);
    this.logger.setContext(VisualCrossingHandler.name);
  }

  async handle (city: string): Promise<GetWeatherResponse> {
    try {
      this.logger.info(`VisualCrossing returned weather for "${city}"`);

      return await this.client.getWeatherData(city);
    } catch (e) {
      this.logger.warn(`VisualCrossing failed for "${city}": ${e.message}`);

      return super.handle(city, e);
    }
  }
}
