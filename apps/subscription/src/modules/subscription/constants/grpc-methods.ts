export const GRPC_SUBSCRIPTION_SERVICE = 'SubscriptionService';

export const SubscriptionServiceMethods = {
  SUBSCRIBE: 'Subscribe',
  CONFIRM: 'Confirm',
  UNSUBSCRIBE: 'Unsubscribe',
  GET_CONFIRMED_SUBSCRIPTIONS: 'GetConfirmedSubscriptions',
} as const;
