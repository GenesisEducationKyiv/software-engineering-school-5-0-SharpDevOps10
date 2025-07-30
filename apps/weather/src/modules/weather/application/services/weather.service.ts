import { Injectable, Inject } from '@nestjs/common';
import type { WeatherServiceInterface } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { WeatherHandlerInterface } from '../handlers/interfaces/weather-handler.interface';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RpcError } from '@grpc-types/grpc-error.type';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_HANDLER)
    private readonly handler: WeatherHandlerInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
    this.logger.setContext(WeatherService.name);
  }

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const result = await this.handler.handle(city);

    this.logger.debug(`Fetched weather data for "${city}"`, result);

    return result;
  }

  async isCityValid (city: string): Promise<boolean> {
    try {
      await this.getWeather(city);
      this.logger.info(`City "${city}" is valid`);

      return true;
    } catch (error) {
      if (
        error instanceof RpcException &&
        (error.getError() as RpcError)?.code === status.NOT_FOUND
      ) {
        this.logger.warn(`City "${city}" is NOT valid`);

        return false;
      }
      this.logger.error(
        `Unexpected error while validating city "${city}": ${error.message}`,
        { stack: error.stack },
      );
      throw error;
    }
  }
}
