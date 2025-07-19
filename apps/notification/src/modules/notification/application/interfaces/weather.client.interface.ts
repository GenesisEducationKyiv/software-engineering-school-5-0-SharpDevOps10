import { GetWeatherRequest, GetWeatherResponse } from '@generated/weather';

export interface IWeatherClient {
  getWeather(city: string) : Promise<GetWeatherResponse>;
}
