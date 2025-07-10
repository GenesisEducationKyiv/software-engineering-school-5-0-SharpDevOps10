import { Module } from '@nestjs/common';
import { SubscriptionController } from './presentation/subscription.controller';
import { SubscriptionService } from './application/subscription.service';
import { SubscriptionRepository } from './infrastructure/repositories/subscription.repository';
import { PrismaModule } from '@database/prisma.module';
import { EmailModule } from '@email/email.module';
import { IsCityValidConstraint } from '@subscription/presentation/validators/is-city-valid.validator';
import { WeatherModule } from '@weather/weather.module';
import { TokenService } from '@subscription/infrastructure/token/token.service';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { ConfigModule } from '@config/config.module';

@Module({
  controllers: [SubscriptionController],
  providers: [
    IsCityValidConstraint,
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
  ],
  imports: [PrismaModule, EmailModule, WeatherModule, ConfigModule],
  exports: [
    SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_SERVICE,
    SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_NOTIFIER,
  ],
})
export class SubscriptionModule {}
