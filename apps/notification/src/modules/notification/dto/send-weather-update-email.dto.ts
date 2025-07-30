import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export type SendWeatherUpdateEmailDto = {
  email: string;
  city: string;
  frequency: string;
  weather: GetWeatherResponse;
}
