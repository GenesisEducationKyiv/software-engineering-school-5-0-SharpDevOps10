import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

export type SendWeatherUpdateEmailDto = {
  email: string;
  city: string;
  frequency: string;
  weather: GetWeatherResponse;
}
