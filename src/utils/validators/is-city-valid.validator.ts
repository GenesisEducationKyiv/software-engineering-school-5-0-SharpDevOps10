import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';

@ValidatorConstraint({ name: 'IsCityValidConstraint', async: true })
@Injectable()
export class IsCityValidConstraint implements ValidatorConstraintInterface {
  constructor (
    @Inject(DI_TOKENS.WEATHER_API_CLIENT)
    private readonly weatherApiClient: IWeatherApiClient,
  ) {}

  async validate (city: string): Promise<boolean> {
    try {
      await this.weatherApiClient.getWeatherData(city);
      
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage (): string {
    return 'City does not exist';
  }
}
