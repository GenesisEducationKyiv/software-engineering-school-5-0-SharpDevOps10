import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export interface SubscriptionServiceInterface {
  subscribe(dto: CreateSubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(subscription: string): Promise<void>;
}
