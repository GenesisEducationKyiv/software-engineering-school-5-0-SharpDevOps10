import { BaseWeatherHandler } from '@weather/handlers/base-weather.handler';
import { Inject, Injectable } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';

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
