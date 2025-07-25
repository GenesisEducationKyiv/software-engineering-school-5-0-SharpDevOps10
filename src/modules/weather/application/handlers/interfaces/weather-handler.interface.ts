import { GetWeatherResponse } from '@weather/responses/get-weather.response';

export interface IWeatherHandler {
  setNext(handler: IWeatherHandler): IWeatherHandler;
  handle(city: string, lastError?: unknown): Promise<GetWeatherResponse>;
}
