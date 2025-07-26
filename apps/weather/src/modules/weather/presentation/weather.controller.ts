import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from '../constants/di-tokens';
import { IWeatherService } from '../application/services/interfaces/weather.service.interface';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

@Controller('weather')
export class WeatherController {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,
  ) {}

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    return await this.weatherService.getWeather(city);
  }

  @Get('is-city-valid')
  async isCityValid (@Query('city') city: string): Promise<boolean> {
    return await this.weatherService.isCityValid(city);
  }
}
