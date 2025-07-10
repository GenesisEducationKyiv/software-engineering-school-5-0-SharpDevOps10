import { GetWeatherResponse } from '@weather/responses/get-weather.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<GetWeatherResponse>;
}
