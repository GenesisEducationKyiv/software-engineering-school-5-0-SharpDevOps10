import { SendConfirmationEmailDto } from '../dto/send-confirmation-email.dto';
import { SendWeatherUpdateEmailDto } from '../dto/send-weather-update-email.dto';

export interface IEmailService {
  sendConfirmationEmail(data: SendConfirmationEmailDto): Promise<void>;
  sendWeatherUpdateEmail(data: SendWeatherUpdateEmailDto): Promise<void>;
}
