import { Controller, Inject } from '@nestjs/common';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { SubscriptionServiceInterface } from '../application/interfaces/subscription.service.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SUBSCRIPTION_EVENT_PATTERNS } from '@utils/constants/brokers/subscription-event.pattern';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { Subscription } from '@prisma/client';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Controller()
export class SubscriptionConsumer {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @MessagePattern(SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS)
  async handleGetConfirmedSubscriptions (
    @Payload() frequency: SubscriptionFrequencyEnum
  ): Promise< { subscriptions: Subscription[] }> {
    const subscriptions = await this.subscriptionService.getConfirmedSubscriptions(frequency);

    this.logger.info(`Retrieved ${subscriptions.length} confirmed subscriptions for frequency "${String(frequency)}"`);

    return { subscriptions };
  }
}
