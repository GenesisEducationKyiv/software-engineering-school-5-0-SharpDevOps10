import { Inject, Injectable } from '@nestjs/common';
import { INotificationEmailSender } from '../../application/interfaces/notification.email-sender.interface';
import { SendWeatherUpdateEmailDto } from '../../dto/send-weather-update-email.dto';
import { EMAIL_PRODUCER_DI_TOKENS } from '@utils/modules/producers/email-producer/di-tokens';
import { EmailProducerInterface } from '@utils/modules/producers/email-producer/interfaces/email-producer.interface';
import { EmailTemplateEnum } from '@grpc-types/email-template.enum';

@Injectable()
export class NotificationEmailSenderService implements INotificationEmailSender {
  constructor (
    @Inject(EMAIL_PRODUCER_DI_TOKENS.EMAIL_PRODUCER)
    private readonly emailProducer: EmailProducerInterface,
  ) {}

  sendWeatherUpdateEmail ({
    email,
    city,
    weather,
    frequency,
  }: SendWeatherUpdateEmailDto): void {
    this.emailProducer.sendEmail({
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
