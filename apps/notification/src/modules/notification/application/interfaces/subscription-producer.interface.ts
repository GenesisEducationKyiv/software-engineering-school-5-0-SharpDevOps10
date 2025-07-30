import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { Subscription } from '@prisma/client';

export interface SubscriptionProducerInterface {
  getConfirmedSubscriptions(frequency: SubscriptionFrequencyEnum): Promise<{ subscriptions: Subscription[] }>;
}
