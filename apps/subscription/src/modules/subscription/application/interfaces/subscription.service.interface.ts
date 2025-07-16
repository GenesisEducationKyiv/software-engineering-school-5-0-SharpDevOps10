import { CreateSubscriptionDto } from '../../presentation/dto/create-subscription.dto';
import type { Subscription } from '@prisma/client';

export interface ISubscriptionService {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
  getConfirmedSubscriptions(): Promise<Subscription[]>;
}
