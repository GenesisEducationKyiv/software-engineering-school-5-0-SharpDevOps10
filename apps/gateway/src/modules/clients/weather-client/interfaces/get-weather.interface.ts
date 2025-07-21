import { GetWeatherResponse } from '@generated/weather';

export interface GetWeatherClientInterface {
  getWeather(city: string) : Promise<GetWeatherResponse>;
}
