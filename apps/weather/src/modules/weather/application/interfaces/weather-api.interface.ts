import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<GetWeatherResponse>;
}
