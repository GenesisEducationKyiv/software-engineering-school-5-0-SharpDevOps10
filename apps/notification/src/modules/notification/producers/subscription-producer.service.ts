import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionProducerInterface } from '../application/interfaces/subscription-producer.interface';
import { SUBSCRIPTION__PRODUCER_DI_TOKENS } from './di-tokens';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { firstValueFrom } from 'rxjs';
import { SUBSCRIPTION_EVENT_PATTERNS } from '@utils/constants/brokers/subscription-event.pattern';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionProducerService implements SubscriptionProducerInterface {
  constructor (
    @Inject(SUBSCRIPTION__PRODUCER_DI_TOKENS.NOTIFICATION_BROKER_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  async getConfirmedSubscriptions (frequency: SubscriptionFrequencyEnum): Promise<{ subscriptions: Subscription[] }> {
    return await firstValueFrom(
      this.client.send(
        SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS,
        frequency,
      ),
    );
  }

}
