import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';

export interface IWeatherService {
  getWeather(city: string): Promise<GetWeatherResponse>;
  isCityValid(city: string): Promise<boolean>;
}
