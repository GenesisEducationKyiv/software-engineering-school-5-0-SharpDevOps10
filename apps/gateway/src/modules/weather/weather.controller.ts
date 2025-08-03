import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from './di-tokens';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Controller('weather')
export class WeatherController {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: WeatherServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    //this.logger.info(`GET /weather?city=${city}`);

    return this.weatherService.getWeather(city);
  }
}
