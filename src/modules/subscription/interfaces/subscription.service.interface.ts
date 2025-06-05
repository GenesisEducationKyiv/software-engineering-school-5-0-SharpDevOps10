import { CreateSubscriptionDto } from '@subscription/dto/create-subscription.dto';
import { Subscription } from '@prisma/client';

export interface ISubscriptionService {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(subscription: Subscription): Promise<void>;
  unsubscribe(subscription: Subscription): Promise<void>;
  getConfirmedSubscriptions(): Promise<Subscription[]>;
}
