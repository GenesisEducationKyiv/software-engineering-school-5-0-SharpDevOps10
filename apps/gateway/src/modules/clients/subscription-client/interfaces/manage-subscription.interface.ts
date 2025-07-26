import { CreateSubscriptionRequest } from '@generated/subscription';
import { Empty } from '@generated/common/empty';

export interface ManageSubscriptionInterface {
  subscribe(request: CreateSubscriptionRequest) : Promise<Empty>;
  confirm(token: string): Promise<Empty>;
  unsubscribe(token: string): Promise<Empty>;
}
