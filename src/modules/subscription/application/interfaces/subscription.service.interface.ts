import { CreateSubscriptionDto } from '@subscription/presentation/dto/create-subscription.dto';
import type { Subscription } from '@prisma/client';

export interface ISubscriptionService {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(subscription: Subscription): Promise<void>;
  unsubscribe(subscription: Subscription): Promise<void>;
}
