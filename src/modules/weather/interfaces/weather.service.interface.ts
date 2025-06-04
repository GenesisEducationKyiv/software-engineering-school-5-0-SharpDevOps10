import { GetWeatherResponse } from '@weather/responses/get-weather.response';

export interface IWeatherService {
  getWeather(city: string): Promise<GetWeatherResponse>;
}
