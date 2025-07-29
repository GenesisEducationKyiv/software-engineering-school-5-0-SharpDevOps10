import { Controller, Inject } from '@nestjs/common';
import { SUBSCRIPTION_DI_TOKENS } from '../subscription/constants/di-tokens';
import { ISubscriptionService } from '../subscription/application/interfaces/subscription.service.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SUBSCRIPTION_EVENT_PATTERNS } from '@utils/constants/brokers/subscription-event.pattern';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { Subscription } from '@prisma/client';

@Controller()
export class SubscriptionConsumer {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @MessagePattern(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS)
  async handleGetConfirmedSubscriptions (
    @Payload() frequency: SubscriptionFrequencyEnum
  ): Promise< { subscriptions: Subscription[] }> {
    const subscriptions = await this.subscriptionService.getConfirmedSubscriptions(frequency);
    
    return { subscriptions };
  }
}
