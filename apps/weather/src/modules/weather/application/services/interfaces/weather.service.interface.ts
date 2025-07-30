import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export interface IWeatherService {
  getWeather(city: string): Promise<GetWeatherResponse>;
  isCityValid(city: string): Promise<boolean>;
}
