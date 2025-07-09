import { Inject, Injectable } from '@nestjs/common';
import { BaseWeatherHandler } from '@weather/application/handlers/base-weather.handler';
import { WEATHER_DI_TOKENS } from '../../di-tokens';
import { IWeatherApiClient } from '@weather/application/interfaces/weather-api.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';

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
