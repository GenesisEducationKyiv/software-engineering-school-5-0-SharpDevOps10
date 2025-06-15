import type { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
