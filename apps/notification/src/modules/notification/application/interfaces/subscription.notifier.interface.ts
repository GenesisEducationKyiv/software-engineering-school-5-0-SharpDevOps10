import { ConfirmedSubscriptionsResponse } from '@generated/subscription';

export interface ISubscriptionNotifier {
  getConfirmedSubscriptions(): Promise<ConfirmedSubscriptionsResponse>;
}
