import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import type { IWeatherService } from '@weather/application/services/interfaces/weather.service.interface';
import type { IEmailService } from '@shared/interfaces/email-service.interface';
import type { ILoggerService } from '@shared/interfaces/logger.service.interface';
import type { ISubscriptionNotifier } from '../interfaces/subscription.notifier.interface';
import type { IEmailJobService } from '../interfaces/email.job.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';
import { LOGGER_DI_TOKENS } from '@logger/di-tokens';

@Injectable()
export class EmailJobService implements IEmailJobService {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_NOTIFIER)
    private readonly subscriptionService: ISubscriptionNotifier,

    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,

    @Inject(EMAIL_DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  async sendWeatherEmailsByFrequency (frequency: SubscriptionFrequencyEnum): Promise<void> {
    const subscriptions = await this.subscriptionService.getConfirmedSubscriptions();
    const filtered = subscriptions.filter((sub) => sub.frequency === frequency);

    const label = frequency === SubscriptionFrequencyEnum.HOURLY ? 'hourly' : 'daily';

    for (const sub of filtered) {
      try {
        const weather = await this.weatherService.getWeather(sub.city);
        await this.emailService.sendWeatherUpdateEmail(sub.email, sub.city, weather, label);

        this.logger.log(`Sent weather to ${sub.email} [${sub.city}]`);
      } catch (err) {
        this.logger.error(`Failed to send to ${sub.email}: ${err.message}`);
      }
    }
  }
}
