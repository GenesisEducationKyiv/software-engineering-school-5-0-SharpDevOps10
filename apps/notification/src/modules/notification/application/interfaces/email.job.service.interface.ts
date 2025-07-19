import { SubscriptionFrequencyEnum } from '@shared-types/common/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
