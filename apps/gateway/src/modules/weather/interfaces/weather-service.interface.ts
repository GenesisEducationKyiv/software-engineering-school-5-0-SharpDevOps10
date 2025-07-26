import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

export interface WeatherServiceInterface {
  getWeather(city: string): Promise<GetWeatherResponse>;
}
