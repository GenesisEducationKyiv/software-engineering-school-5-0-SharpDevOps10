import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';

export type CreateSubscriptionDto = {
  email: string;

  city: string;

  frequency: SubscriptionFrequencyEnum;
};
