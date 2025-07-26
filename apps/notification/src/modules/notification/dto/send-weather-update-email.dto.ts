import { GetWeatherResponse } from '@generated/weather';

export type SendWeatherUpdateEmailDto = {
  email: string;
  city: string;
  frequency: string;
  weather: GetWeatherResponse;
}
