import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';

export interface IEmailJobService {
  sendWeatherEmailsByFrequency(frequency: SubscriptionFrequencyEnum): Promise<void>;
}
