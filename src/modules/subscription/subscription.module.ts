import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { PrismaModule } from '@database/prisma.module';
import { EmailModule } from '@email/email.module';
import { IsCityValidConstraint } from '@utils/validators/is-city-valid.validator';
import { WeatherModule } from '@weather/weather.module';
import { TokenService } from '@subscription/token/token.service';

@Module({
  controllers: [SubscriptionController],
  providers: [
    IsCityValidConstraint,
    {
      provide: DI_TOKENS.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
    {
      provide: DI_TOKENS.SUBSCRIPTION_SERVICE,
      useClass: SubscriptionService,
    },
    {
      provide: DI_TOKENS.SUBSCRIPTION_NOTIFIER,
      useExisting: DI_TOKENS.SUBSCRIPTION_SERVICE,
    },
    {
      provide: DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE,
      useClass: TokenService,
    },
  ],
  imports: [PrismaModule, EmailModule, WeatherModule],
  exports: [
    DI_TOKENS.SUBSCRIPTION_SERVICE,
    DI_TOKENS.SUBSCRIPTION_NOTIFIER,
  ],
})
export class SubscriptionModule {}
