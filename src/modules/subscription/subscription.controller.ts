import { Body, Controller, Post, Param, Get, Inject } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionByTokenPipe } from '@utils/pipes/subscription-by-token.pipe';
import { UUIDValidationPipe } from '@utils/pipes/uuid-validation.pipe';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import type { Subscription } from '@prisma/client';
import type { ISubscriptionService } from './interfaces/subscription.service.interface';

@Controller()
export class SubscriptionController {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  @Post('subscribe')
  async subscribe (@Body() body: CreateSubscriptionDto): Promise<{ message: string }> {
    await this.subscriptionService.subscribe(body);
    
    return {
      message: 'Subscription successful. Confirmation email sent.',
    };
  }

  @Get('confirm/:token')
  async confirm (
    @Param('token', UUIDValidationPipe, SubscriptionByTokenPipe) subscription: Subscription
  ): Promise<{ message: string }> {
    await this.subscriptionService.confirm(subscription);
    
    return { 
      message: 'Subscription confirmed successfully', 
    };
  }

  @Get('unsubscribe/:token')
  async unsubscribe (
    @Param('token', UUIDValidationPipe, SubscriptionByTokenPipe) subscription: Subscription
  ): Promise<{ message: string }> {
    await this.subscriptionService.unsubscribe(subscription);
    
    return {
      message: 'Unsubscribed successfully',
    };
  }
}
