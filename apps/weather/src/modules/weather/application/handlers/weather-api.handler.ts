import { Inject, Injectable } from '@nestjs/common';
import { BaseWeatherHandler } from './base-weather.handler';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

@Injectable()
export class WeatherApiHandler extends BaseWeatherHandler {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_API_CLIENT)
    private readonly client: IWeatherApiClient,
  ) {
    super();
  }

  async handle (city: string): Promise<GetWeatherResponse> {
    try {
      return await this.client.getWeatherData(city);
    } catch (e) {

      return super.handle(city, e);
    }
  }

}
