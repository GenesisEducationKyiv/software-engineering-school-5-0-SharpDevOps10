import { IsEmail, IsEnum, IsString, Validate } from 'class-validator';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import { IsCityValidConstraint } from '@utils/validators/is-city-valid.validator';

export class CreateSubscriptionDto {
  @IsEmail()
    email: string;

  @Validate(IsCityValidConstraint)
  @IsString()
    city: string;

  @IsEnum(SubscriptionFrequencyEnum)
    frequency: SubscriptionFrequencyEnum;
}
