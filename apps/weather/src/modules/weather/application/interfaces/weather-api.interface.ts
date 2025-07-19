import { GetWeatherResponse } from '../../responses/get-weather.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<GetWeatherResponse>;
}
