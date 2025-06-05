import { GetWeatherResponse } from '@weather/responses/get-weather.response';

export interface IEmailService {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
  sendWeatherUpdateEmail(email: string, city: string, weather: GetWeatherResponse, frequency: string): Promise<void>;
}
