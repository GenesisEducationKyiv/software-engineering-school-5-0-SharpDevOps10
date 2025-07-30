import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';

export type CreateSubscriptionDto = {
  email: string;

  city: string;

  frequency: SubscriptionFrequencyEnum;
};
