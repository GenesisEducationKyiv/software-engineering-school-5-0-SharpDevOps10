import { IWeatherHandler } from './interfaces/weather-handler.interface';
import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';
import { NotFoundRpcException, UnavailableException } from '@exceptions/grpc-exceptions';

export abstract class BaseWeatherHandler implements IWeatherHandler {
  private nextHandler: IWeatherHandler;

  setNext (handler: IWeatherHandler): IWeatherHandler {
    this.nextHandler = handler;

    return handler;
  }

  async handle (city: string, lastError?: unknown): Promise<GetWeatherResponse> {
    if (this.nextHandler) return this.nextHandler.handle(city, lastError);

    if (lastError instanceof NotFoundRpcException) throw lastError;

    throw new UnavailableException(
      `No weather providers could handle request for city "${city}".`,
    );
  }
}
