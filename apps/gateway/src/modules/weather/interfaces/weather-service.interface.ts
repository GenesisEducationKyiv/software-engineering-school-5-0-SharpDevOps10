import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';

export interface WeatherServiceInterface {
  getWeather(city: string): Promise<GetWeatherResponse>;
}
