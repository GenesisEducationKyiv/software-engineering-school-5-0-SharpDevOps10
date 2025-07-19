import { SendWeatherUpdateEmailDto } from '../../dto/send-weather-update-email.dto';

export interface INotificationEmailSender {
  sendWeatherUpdateEmail(data: SendWeatherUpdateEmailDto): Promise<void>;
}
