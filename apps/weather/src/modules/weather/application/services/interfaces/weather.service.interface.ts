import { GetWeatherResponse } from '../../../responses/get-weather.response';

export interface IWeatherService {
  getWeather(city: string): Promise<GetWeatherResponse>;
  isCityValid(city: string): Promise<boolean>;
}
