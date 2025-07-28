import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionService } from './interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { ITokenService } from './interfaces/token.service.interface';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { ISubscriptionEmailSender } from './interfaces/subscription.email-sender.interface';
import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundRpcException,
} from '@exceptions/grpc-exceptions';
import { IWeatherClient } from './interfaces/weather-client.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_EMAIL_SENDER)
    private readonly emailService: ISubscriptionEmailSender,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE)
    private readonly tokenService: ITokenService,

    @Inject(SUBSCRIPTION_DI_TOKENS.WEATHER_CLIENT)
    private readonly weatherClient: IWeatherClient,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    this.validateFrequency(dto.frequency);

    const { email, city } = dto;

    const { isValid } = await this.weatherClient.isCityValid({ city });
    if (!isValid) {
      throw new NotFoundRpcException(`City "${city}" not found`);
    }

    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new AlreadyExistsException('Email already subscribed for this city');

    const token = this.tokenService.generateToken();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    this.emailService.sendConfirmationEmail(email, token);
  }

  async confirm (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (subscription.confirmed) {
      throw new AlreadyExistsException('Subscription already confirmed');
    }

    if (this.tokenService.isTokenExpired(subscription.createdAt)) {
      throw new InvalidArgumentException('Invalid token');
    }

    await this.subscriptionRepository.updateSubscription(subscription.id, {
      confirmed: true,
    });
  }

  async unsubscribe (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (!subscription.confirmed) throw new AlreadyExistsException('Subscription not confirmed');

    await this.subscriptionRepository.deleteSubscription(subscription.id);
  }

  async getConfirmedSubscriptions (frequency: SubscriptionFrequencyEnum): Promise<Subscription[]> {
    return this.subscriptionRepository.getConfirmedSubscriptions(frequency);
  }

  private async getSubscriptionByToken (token: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) throw new NotFoundRpcException('Token not found');

    return subscription;
  }

  private validateFrequency (frequency: string): void {
    const allowed = Object.values(SubscriptionFrequencyEnum);

    if (!allowed.includes(frequency as SubscriptionFrequencyEnum)) {
      throw new InvalidArgumentException(
        `Invalid frequency "${frequency}". Allowed values: ${allowed.join(', ')}`
      );
    }
  }
}
