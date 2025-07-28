import { Inject } from '@nestjs/common';
import type { ISubscriptionService } from '../application/interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods } from '../constants/grpc-methods';
import { CreateSubscriptionRequest, GetConfirmedSubscriptionsRequest, TokenRequest } from '@generated/subscription';
import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';
import { Empty } from '@generated/common/empty';
import { Subscription } from '@prisma/client';

@GrpcService()
export class SubscriptionController {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @GrpcMethod(GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods.SUBSCRIBE)
  async subscribe (request: CreateSubscriptionRequest): Promise<Empty> {
    const dto: CreateSubscriptionDto = {
      email: request.email,
      city: request.city,
      frequency: request.frequency as SubscriptionFrequencyEnum,
    };

    await this.subscriptionService.subscribe(dto);
    
    return {};
  }

  @GrpcMethod(GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods.CONFIRM)
  async confirm (request: TokenRequest): Promise<Empty> {
    await this.subscriptionService.confirm(request.token);

    return {};
  }

  @GrpcMethod(GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods.UNSUBSCRIBE)
  async unsubscribe (request: TokenRequest): Promise<Empty> {
    await this.subscriptionService.unsubscribe(request.token);
    
    return {};
  }

  @GrpcMethod(GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods.GET_CONFIRMED_SUBSCRIPTIONS)
  async getConfirmedSubscriptions (request: GetConfirmedSubscriptionsRequest): Promise<{ subscriptions: Subscription[] }> {
    const frequency = request.frequency as SubscriptionFrequencyEnum;
    const subscriptions = await this.subscriptionService.getConfirmedSubscriptions(frequency);

    return { subscriptions };
  }
}
