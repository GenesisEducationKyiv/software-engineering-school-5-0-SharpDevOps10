import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export interface WeatherServiceInterface {
  getWeather(city: string): Promise<GetWeatherResponse>;
}
