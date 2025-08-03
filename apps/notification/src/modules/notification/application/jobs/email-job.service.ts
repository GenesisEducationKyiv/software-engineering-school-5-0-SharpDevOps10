import { Inject, Injectable } from '@nestjs/common';
import { EmailJobServiceInterface } from '../interfaces/email.job.service.interface';
import { NOTIFICATION_DI_TOKENS } from '../../di-tokens';
import { IWeatherClient } from '../interfaces/weather.client.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { INotificationEmailSender } from '../interfaces/notification.email-sender.interface';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { SubscriptionProducerInterface } from '../interfaces/subscription-producer.interface';
import { TrackEmailSendMetrics } from '../../../metrics/decorators/track-email-send-metrics.decorator';

@Injectable()
export class EmailJobService implements EmailJobServiceInterface {
  constructor (
    @Inject(NOTIFICATION_DI_TOKENS.SUBSCRIPTION_PRODUCER)
    private readonly subscriptionProducer: SubscriptionProducerInterface,

    @Inject(NOTIFICATION_DI_TOKENS.WEATHER_CLIENT)
    private readonly weatherService: IWeatherClient,

    @Inject(NOTIFICATION_DI_TOKENS.NOTIFICATION_EMAIL_SENDER)
    private readonly emailService: INotificationEmailSender,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @TrackEmailSendMetrics()
  async sendWeatherEmailsByFrequency (frequency: SubscriptionFrequencyEnum): Promise<void> {
    const { subscriptions } = await this.subscriptionProducer.getConfirmedSubscriptions(frequency);
    const label = frequency === SubscriptionFrequencyEnum.HOURLY ? 'hourly' : 'daily';

    for (const sub of subscriptions) {
      try {
        const weather = await this.weatherService.getWeather(sub.city);
        this.emailService.sendWeatherUpdateEmail({
          email: sub.email,
          city: sub.city,
          weather,
          frequency: label,
        });

        this.logger.info(`Sent weather to ${sub.email} [${sub.city}]`, {
          context: this.constructor.name,
          method: 'sendWeatherEmailsByFrequency',
        });
      } catch (err) {
        this.logger.error(`Failed to send to ${sub.email}`, {
          context: this.constructor.name,
          method: 'sendWeatherEmailsByFrequency',
          error: err,
        });
      }
    }
  }
}
