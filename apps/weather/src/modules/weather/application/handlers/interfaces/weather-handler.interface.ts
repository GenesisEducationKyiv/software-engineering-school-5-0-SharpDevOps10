import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export interface WeatherHandlerInterface {
  setNext(handler: WeatherHandlerInterface): WeatherHandlerInterface;
  handle(city: string, lastError?: unknown): Promise<GetWeatherResponse>;
}
