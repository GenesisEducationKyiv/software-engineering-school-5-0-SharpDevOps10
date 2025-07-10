import { IsEmail, IsEnum, IsString, Validate } from 'class-validator';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import { IsCityValidConstraint } from '@subscription/presentation/validators/is-city-valid.validator';

export class CreateSubscriptionDto {
  @IsEmail()
    email: string;

  @Validate(IsCityValidConstraint)
  @IsString()
    city: string;

  @IsEnum(SubscriptionFrequencyEnum)
    frequency: SubscriptionFrequencyEnum;
}
