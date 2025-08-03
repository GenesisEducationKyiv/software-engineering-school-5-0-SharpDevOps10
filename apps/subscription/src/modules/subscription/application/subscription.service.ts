import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionServiceInterface } from './interfaces/subscription.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { TokenServiceInterface } from './interfaces/token.service.interface';
import { SubscriptionRepositoryInterface } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { SubscriptionEmailSenderInterface } from './interfaces/subscription.email-sender.interface';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundRpcException,
} from '@exceptions/grpc-exceptions';
import { WeatherClientInterface } from './interfaces/weather-client.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { TrackSubscribeMetrics } from '../../metrics/decorators/track-subscribe-metrics.decorator';
import { TrackConfirmMetrics } from '../../metrics/decorators/track-confirm-metrics.decorator';
import { TrackUnsubscribeMetrics } from '../../metrics/decorators/track-unsubscribe-metrics.decorator';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_EMAIL_SENDER)
    private readonly emailService: SubscriptionEmailSenderInterface,

    @Inject(SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE)
    private readonly tokenService: TokenServiceInterface,

    @Inject(SUBSCRIPTION_DI_TOKENS.WEATHER_CLIENT)
    private readonly weatherClient: WeatherClientInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @TrackSubscribeMetrics()
  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    this.validateFrequency(dto.frequency);

    const { email, city } = dto;

    const { isValid } = await this.weatherClient.isCityValid({ city });
    if (!isValid) {
      this.logger.warn(`Attempted to subscribe with invalid city "${city}"`, {
        context: this.constructor.name,
        method: 'subscribe',
      });
      throw new NotFoundRpcException(`City "${city}" not found`);
    }

    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) {
      this.logger.warn(`Duplicate subscription attempt: ${email} already subscribed to ${city}`, {
        context: this.constructor.name,
        method: 'subscribe',
      });
      throw new AlreadyExistsException('Email already subscribed for this city');
    }

    const token = this.tokenService.generateToken();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    this.logger.info(`Creating new subscription for ${email} in ${city}`, {
      context: this.constructor.name,
      method: 'subscribe',
    });

    this.emailService.sendConfirmationEmail(email, token);

    this.logger.info(`Confirmation email sent to ${email} for city ${city}`, {
      context: this.constructor.name,
      method: 'subscribe',
    });
  }

  @TrackConfirmMetrics()
  async confirm (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (subscription.confirmed) {
      this.logger.warn(`Subscription with token "${token}" already confirmed`, {
        context: this.constructor.name,
        method: 'confirm',
      });
      throw new AlreadyExistsException('Subscription already confirmed');
    }

    if (this.tokenService.isTokenExpired(subscription.createdAt)) {
      this.logger.warn(`Expired token used for confirmation: "${token}"`, {
        context: this.constructor.name,
        method: 'confirm',
      });
      throw new InvalidArgumentException('Invalid token');
    }

    await this.subscriptionRepository.updateSubscription(subscription.id, {
      confirmed: true,
    });

    this.logger.info(`Subscription confirmed for ${subscription.email} [${subscription.city}]`, {
      context: this.constructor.name,
      method: 'confirm',
    });
  }

  @TrackUnsubscribeMetrics()
  async unsubscribe (token: string): Promise<void> {
    const subscription = await this.getSubscriptionByToken(token);
    if (!subscription.confirmed) {
      this.logger.warn(`Unsubscribe attempt on unconfirmed subscription: ${subscription.email}`, {
        context: this.constructor.name,
        method: 'unsubscribe',
      });
      throw new AlreadyExistsException('Subscription not confirmed');
    }

    await this.subscriptionRepository.deleteSubscription(subscription.id);

    this.logger.info(`Subscription deleted for ${subscription.email} [${subscription.city}]`, {
      context: this.constructor.name,
      method: 'unsubscribe',
    });
  }

  async getConfirmedSubscriptions (frequency: SubscriptionFrequencyEnum): Promise<Subscription[]> {
    return this.subscriptionRepository.getConfirmedSubscriptions(frequency);
  }

  private async getSubscriptionByToken (token: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) {
      this.logger.warn('Subscription not found for token', {
        context: this.constructor.name,
        method: this.getSubscriptionByToken.name,
      });
      throw new NotFoundRpcException('Token not found');
    }

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
