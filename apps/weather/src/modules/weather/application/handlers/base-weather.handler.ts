import { WeatherHandlerInterface } from './interfaces/weather-handler.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { NotFoundRpcException, UnavailableException } from '@exceptions/grpc-exceptions';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { Inject } from '@nestjs/common';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

export abstract class BaseWeatherHandler implements WeatherHandlerInterface {
  private nextHandler: WeatherHandlerInterface;

  constructor (
    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    protected readonly logger: LoggerServiceInterface,
  ) {
    this.logger.setContext(BaseWeatherHandler.name);
  }

  setNext (handler: WeatherHandlerInterface): WeatherHandlerInterface {
    this.nextHandler = handler;

    return handler;
  }

  async handle (city: string, lastError?: unknown): Promise<GetWeatherResponse> {
    if (this.nextHandler) {
      this.logger.debug(`Passing city "${city}" to next weather provider...`);

      return this.nextHandler.handle(city, lastError);
    }

    if (lastError instanceof NotFoundRpcException) {
      this.logger.warn(`City "${city}" not found in all weather providers.`);
      throw lastError;
    }

    this.logger.error(`All providers failed for city "${city}".`, lastError);
    throw new UnavailableException(
      `No weather providers could handle request for city "${city}".`,
    );
  }
}
