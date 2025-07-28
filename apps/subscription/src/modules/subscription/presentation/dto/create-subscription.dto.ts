import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';

export type CreateSubscriptionDto = {
  email: string;

  city: string;

  frequency: SubscriptionFrequencyEnum;
};
