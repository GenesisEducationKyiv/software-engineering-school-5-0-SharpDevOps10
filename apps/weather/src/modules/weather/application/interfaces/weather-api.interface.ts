import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<GetWeatherResponse>;
}
