import { Module } from '@nestjs/common';
import { SubscriptionConfigModule } from '../config/subscription-config.module';
import { SubscriptionRepository } from './infrastructure/repositories/subscription.repository';
import { SubscriptionService } from './application/subscription.service';
import { TokenService } from './infrastructure/token/token.service';
import { SUBSCRIPTION_DI_TOKENS } from './constants/di-tokens';
import { SubscriptionEmailSender } from './infrastructure/email-sender/subscription.email-sender';
import { PrismaModule } from '../../database/prisma.module';
import { SubscriptionController } from './presentation/subscription.controller';
import { WeatherClientModule } from '../clients/weather-client/weather-client.module';
import { EmailProducerModule } from '@utils/modules/producers/email-producer/email-producer.module';
import { SubscriptionConsumer } from '../consumers/subscription-consumer.service';

@Module({
  controllers: [SubscriptionController, SubscriptionConsumer],
  providers: [
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_NOTIFIER,
      useExisting: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE,
    },
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE,
      useClass: TokenService,
    },
    {
      provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_EMAIL_SENDER,
      useClass: SubscriptionEmailSender,
    },
  ],
  imports: [
    PrismaModule,
    SubscriptionConfigModule,
    EmailProducerModule,
    WeatherClientModule,
  ],
  exports: [
    SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE,
    SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_NOTIFIER,
  ],
})
export class SubscriptionModule {}
