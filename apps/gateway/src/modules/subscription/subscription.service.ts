import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import { GATEWAY_CLIENT_DI_TOKENS } from '../clients/di-tokens';
import { ManageSubscriptionInterface } from '../clients/subscription-client/interfaces/manage-subscription.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor (
    @Inject(GATEWAY_CLIENT_DI_TOKENS.SUBSCRIPTION_CLIENT)
    private readonly subscriptionClient: ManageSubscriptionInterface,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    await this.subscriptionClient.subscribe(dto);
  }

  async confirm (token: string): Promise<void> {
    await this.subscriptionClient.confirm(token);
  }

  async unsubscribe (token: string): Promise<void> {
    await this.subscriptionClient.unsubscribe(token);
  }
}
