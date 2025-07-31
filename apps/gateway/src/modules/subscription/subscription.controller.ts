import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { SUBSCRIPTION_DI_TOKENS } from './di-tokens';
import { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SUBSCRIPTION_MESSAGES } from './constants/subscription.messages';
import { TokenDto } from './dto/token.dto';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Controller()
export class SubscriptionController {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @Post('subscribe')
  async subscribe (@Body() body: CreateSubscriptionDto): Promise<{ message: string }> {
    this.logger.info('POST /subscribe', body);
    await this.subscriptionService.subscribe(body);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CREATED };
  }

  @Get('confirm/:token')
  async confirm (
    @Param() dto: TokenDto,
  ): Promise<{ message: string }> {
    this.logger.info(`GET /confirm/${dto.token}`);
    await this.subscriptionService.confirm(dto.token);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CONFIRMED };
  }

  @Get('unsubscribe/:token')
  async unsubscribe (
    @Param() dto: TokenDto,
  ): Promise<{ message: string }> {
    this.logger.info(`GET /unsubscribe/${dto.token}`);
    await this.subscriptionService.unsubscribe(dto.token);

    return { message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_UNSUBSCRIBED };
  }
}
