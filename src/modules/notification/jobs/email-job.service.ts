import { Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import type { IWeatherService } from '@weather/interfaces/weather.service.interface';
import type { IEmailService } from '@email/interfaces/email-service.interface';
import type { ILoggerService } from '@logger/logger.service.interface';
import type { ISubscriptionNotifier } from '@subscription/interfaces/subscription.notifier.interface';
import type { IEmailJobService } from '@notification/interfaces/email.job.service.interface';

@Injectable()
export class EmailJobService implements IEmailJobService {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_NOTIFIER)
    private readonly subscriptionService: ISubscriptionNotifier,
    @Inject(DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,
    @Inject(DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(DI_TOKENS.LOGGER_SERVICE)
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
