import type { Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from '../../presentation/dto/create-subscription.dto';

export interface ISubscriptionRepository {
  findByEmailAndCity (email: string, city: string): Promise<Subscription>;
  createSubscription (data: CreateSubscriptionDto & { token: string }): Promise<void>;
  findByToken (token: string): Promise<Subscription>;
  updateSubscription (id: string, data: Partial<Subscription>): Promise<void>;
  deleteSubscription (id: string): Promise<void>;
  getConfirmedSubscriptions(): Promise<Subscription[]>;
}
