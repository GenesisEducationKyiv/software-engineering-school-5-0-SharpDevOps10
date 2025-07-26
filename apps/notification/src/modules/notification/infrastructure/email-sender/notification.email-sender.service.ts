import { Inject, Injectable } from '@nestjs/common';
import { INotificationEmailSender } from '../../application/interfaces/notification.email-sender.interface';
import { NOTIFICATION_DI_TOKENS } from '../../di-tokens';
import { IEmailClient } from '@shared-types/email/email-client.interface';
import { SendWeatherUpdateEmailDto } from '../../dto/send-weather-update-email.dto';
import { EmailTemplateEnum } from '@shared-types/common/email-template.enum';

@Injectable()
export class NotificationEmailSenderService implements INotificationEmailSender {
  constructor (
    @Inject(NOTIFICATION_DI_TOKENS.EMAIL_CLIENT)
    private readonly emailClient: IEmailClient,
  ) {}

  async sendWeatherUpdateEmail ({
    email,
    city,
    weather,
    frequency,
  }: SendWeatherUpdateEmailDto): Promise<void> {
    await this.emailClient.sendEmail({
      to: email,
      subject: `Weather update for ${ city }`,
      template: EmailTemplateEnum.WEATHER_UPDATE,
      context: {
        city,
        frequency,
        ...weather,
      },
    });
  }

}
