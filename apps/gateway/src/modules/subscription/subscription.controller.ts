import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { SUBSCRIPTION_DI_TOKENS } from './di-tokens';
import { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SUBSCRIPTION_MESSAGES } from './constants/subscription.messages';
import { TokenDto } from './dto/token.dto';

@Controller()
export class SubscriptionController {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionServiceInterface,
  ) {
  }

  @Post('subscribe')
  async subscribe (@Body() body: CreateSubscriptionDto): Promise<{ message: string }> {
    await this.subscriptionService.subscribe(body);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CREATED };
  }

  @Get('confirm/:token')
  async confirm (
    @Param() dto: TokenDto,
  ): Promise<{ message: string }> {
    await this.subscriptionService.confirm(dto.token);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CONFIRMED };
  }

  @Get('unsubscribe/:token')
  async unsubscribe (
    @Param() dto: TokenDto,
  ): Promise<{ message: string }> {
    await this.subscriptionService.unsubscribe(dto.token);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_UNSUBSCRIBED };
  }
}
