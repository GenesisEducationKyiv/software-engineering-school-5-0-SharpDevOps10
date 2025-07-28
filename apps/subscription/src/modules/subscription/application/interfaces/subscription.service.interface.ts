import { CreateSubscriptionDto } from '../../presentation/dto/create-subscription.dto';
import type { Subscription } from '@prisma/client';
import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';

export interface ISubscriptionService {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
  getConfirmedSubscriptions(frequency: SubscriptionFrequencyEnum): Promise<Subscription[]>;
}
