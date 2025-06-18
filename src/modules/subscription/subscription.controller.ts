import { Body, Controller, Post, Param, Get, Inject } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionByTokenPipe } from '@utils/pipes/subscription-by-token.pipe';
import { UUIDValidationPipe } from '@utils/pipes/uuid-validation.pipe';
import { SUBSCRIPTION_MESSAGES } from '@utils/constants/subscription.messages';
import type { Subscription } from '@prisma/client';
import type { ISubscriptionService } from './interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';

@Controller()
export class SubscriptionController {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @Post('subscribe')
  async subscribe (@Body() body: CreateSubscriptionDto): Promise<{ message: string }> {
    await this.subscriptionService.subscribe(body);
    
    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CREATED };
  }

  @Get('confirm/:token')
  async confirm (
    @Param('token', UUIDValidationPipe, SubscriptionByTokenPipe) subscription: Subscription
  ): Promise<{ message: string }> {
    await this.subscriptionService.confirm(subscription);
    
    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CONFIRMED };
  }

  @Get('unsubscribe/:token')
  async unsubscribe (
    @Param('token', UUIDValidationPipe, SubscriptionByTokenPipe) subscription: Subscription
  ): Promise<{ message: string }> {
    await this.subscriptionService.unsubscribe(subscription);
    
    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_UNSUBSCRIBED };
  }
}
