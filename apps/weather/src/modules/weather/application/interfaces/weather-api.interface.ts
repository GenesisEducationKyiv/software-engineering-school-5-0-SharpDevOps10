import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<GetWeatherResponse>;
}
