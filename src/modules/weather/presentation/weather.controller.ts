import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import type { IWeatherService } from '@weather/application/services/interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

@Controller('weather')
export class WeatherController {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,
  ) {}

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(city);
  }
}
