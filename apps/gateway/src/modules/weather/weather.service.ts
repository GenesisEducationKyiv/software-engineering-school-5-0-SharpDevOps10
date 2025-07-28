import { Inject, Injectable } from '@nestjs/common';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import { GATEWAY_CLIENT_DI_TOKENS } from '../clients/di-tokens';
import { GetWeatherClientInterface } from '../clients/weather-client/interfaces/get-weather.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor (
    @Inject(GATEWAY_CLIENT_DI_TOKENS.WEATHER_CLIENT)
    private readonly weatherClient: GetWeatherClientInterface,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    return await this.weatherClient.getWeather(city);
  }
}
