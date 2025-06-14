import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetWeatherResponse } from './responses/get-weather.response';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import type { IWeatherService } from '@weather/interfaces/weather.service.interface';

@Controller('weather')
export class WeatherController {
  constructor (
    @Inject(DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,
  ) {}

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(city);
  }
}
