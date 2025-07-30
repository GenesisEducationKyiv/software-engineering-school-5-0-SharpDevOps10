import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
