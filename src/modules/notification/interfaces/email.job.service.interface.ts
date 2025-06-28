import type { SubscriptionFrequencyEnum } from '@subscription/enums/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
