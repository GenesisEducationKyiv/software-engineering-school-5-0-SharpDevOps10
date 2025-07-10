import type { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
