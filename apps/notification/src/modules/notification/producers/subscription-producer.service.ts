import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionProducerInterface } from '../application/interfaces/subscription-producer.interface';
import { SUBSCRIPTION__PRODUCER_DI_TOKENS } from './di-tokens';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { SUBSCRIPTION_EVENT_PATTERNS } from '@utils/constants/brokers/subscription-event.pattern';
import { Subscription } from '@prisma/client';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { requestWithTimeout } from '@utils/timeouts/request-with-timeout';
import { NOTIFICATION_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { NotificationConfigServiceInterface } from '../../config/interfaces/notification-config.service.interface';
import { TrackSubscriptionFetchMetrics } from '../../metrics/decorators/track-subscription-fetch-metrics.decorator';

@Injectable()
export class SubscriptionProducerService implements SubscriptionProducerInterface {
  constructor (
    @Inject(SUBSCRIPTION__PRODUCER_DI_TOKENS.NOTIFICATION_BROKER_CLIENT)
    private readonly client: ClientProxy,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,

    @Inject(NOTIFICATION_CONFIG_DI_TOKENS.NOTIFICATION_CONFIG_SERVICE)
    private readonly configService: NotificationConfigServiceInterface,
  ) {}

  @TrackSubscriptionFetchMetrics()
  async getConfirmedSubscriptions (
    frequency: SubscriptionFrequencyEnum,
  ): Promise<{ subscriptions: Subscription[] }> {
    const observable = this.client.send(
      SUBSCRIPTION_EVENT_PATTERNS.GET_CONFIRMED_SUBSCRIPTIONS,
      frequency,
    );

    try {
      const response = await requestWithTimeout(
        observable,
        this.logger,
        this.configService.getSubscriptionProducerTimeout(),
        this.getConfirmedSubscriptions.name,
      );

      this.logger.info(`Received ${response.subscriptions.length} confirmed subscriptions`, {
        context: this.constructor.name,
        method: this.getConfirmedSubscriptions.name,
      });
      
      return response;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch confirmed subscriptions for frequency "${frequency}". Returning empty list.`,
        {
          context: this.constructor.name,
          method: this.getConfirmedSubscriptions.name,
          error: error?.message,
        },
      );

      return { subscriptions: [] };
    }
  }
}
