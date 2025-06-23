import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { PrismaModule } from '@database/prisma.module';
import { EmailModule } from '@email/email.module';
import { IsCityValidConstraint } from '@utils/validators/is-city-valid.validator';
import { WeatherModule } from '@weather/weather.module';
import { TokenService } from '@subscription/token/token.service';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { ConfigModule } from '@modules/config/config.module';

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
