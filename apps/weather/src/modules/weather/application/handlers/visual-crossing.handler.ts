import { Inject, Injectable } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { BaseWeatherHandler } from './base-weather.handler';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

@Injectable()
export class VisualCrossingHandler extends BaseWeatherHandler {
  constructor (
    @Inject(WEATHER_DI_TOKENS.VISUAL_CROSSING_CLIENT)
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
