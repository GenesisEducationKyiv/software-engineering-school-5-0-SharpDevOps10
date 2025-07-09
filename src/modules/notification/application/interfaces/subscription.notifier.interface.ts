import type { Subscription } from '@prisma/client';

export interface ISubscriptionNotifier {
  getConfirmedSubscriptions(): Promise<Subscription[]>;
}
