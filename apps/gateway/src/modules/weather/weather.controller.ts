import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from './di-tokens';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

@Controller('weather')
export class WeatherController {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: WeatherServiceInterface,
  ) {
  }

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(city);
  }
}
