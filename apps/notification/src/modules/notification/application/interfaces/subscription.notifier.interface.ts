import { ConfirmedSubscriptionsResponse, GetConfirmedSubscriptionsRequest } from '@generated/subscription';

export interface ISubscriptionNotifier {
  getConfirmedSubscriptions(request: GetConfirmedSubscriptionsRequest): Promise<ConfirmedSubscriptionsResponse>;
}
