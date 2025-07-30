import { Inject } from '@nestjs/common';
import type { ISubscriptionService } from '../application/interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { GRPC_SUBSCRIPTION_SERVICE, SubscriptionServiceMethods } from '../constants/grpc-methods';
import { CreateSubscriptionRequest, TokenRequest } from '@generated/subscription';
import { Empty } from '@generated/common/empty';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';

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
}
