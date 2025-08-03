import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';

export interface EmailJobServiceInterface {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
