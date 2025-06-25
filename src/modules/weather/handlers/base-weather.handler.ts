import { IWeatherHandler } from '../interfaces/weather-handler.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';

export abstract class BaseWeatherHandler implements IWeatherHandler {
  private nextHandler: IWeatherHandler;

  setNext (handler: IWeatherHandler): IWeatherHandler {
    this.nextHandler = handler;

    return handler;
  }

  async handle (city: string, lastError?: unknown): Promise<GetWeatherResponse> {
    if (this.nextHandler) {
      return this.nextHandler.handle(city, lastError);
    }

    if (lastError instanceof NotFoundException) throw lastError;

    throw new ServiceUnavailableException(
      `No weather providers could handle request for city "${city}".`,
    );
  }
}
