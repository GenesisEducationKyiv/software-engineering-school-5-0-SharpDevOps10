import { SubscriptionFrequencyEnum } from '@shared-types/common/subscription-frequency.enum';

export type CreateSubscriptionDto = {
  email: string;

  city: string;

  frequency: SubscriptionFrequencyEnum;
};
