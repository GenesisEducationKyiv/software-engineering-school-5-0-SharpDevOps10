import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';

export type SendWeatherUpdateEmailDto = {
  email: string;
  city: string;
  frequency: string;
  weather: GetWeatherResponse;
}
