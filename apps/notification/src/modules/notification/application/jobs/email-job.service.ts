import { Inject, Injectable } from '@nestjs/common';
import { IEmailJobService } from '../interfaces/email.job.service.interface';
import { NOTIFICATION_DI_TOKENS } from '../../di-tokens';
import { ISubscriptionNotifier } from '../interfaces/subscription.notifier.interface';
import { IWeatherClient } from '../interfaces/weather.client.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { ILoggerService } from '@utils/modules/logger/logger.service.interface';
import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';
import { INotificationEmailSender } from '../interfaces/notification.email-sender.interface';

@Injectable()
export class EmailJobService implements IEmailJobService {
  constructor (
    @Inject(NOTIFICATION_DI_TOKENS.SUBSCRIPTION_CLIENT)
    private readonly subscriptionService: ISubscriptionNotifier,

    @Inject(NOTIFICATION_DI_TOKENS.WEATHER_CLIENT)
    private readonly weatherService: IWeatherClient,

    @Inject(NOTIFICATION_DI_TOKENS.NOTIFICATION_EMAIL_SENDER)
    private readonly emailService: INotificationEmailSender,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(EmailJobService.name);
  }

  async sendWeatherEmailsByFrequency (frequency: SubscriptionFrequencyEnum): Promise<void> {
    const { subscriptions } = await this.subscriptionService.getConfirmedSubscriptions({ frequency });
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

        this.logger.log(`Sent weather to ${sub.email} [${sub.city}]`);
      } catch (err) {
        this.logger.error(`Failed to send to ${sub.email}: ${err.message}`);
      }
    }
  }
}
