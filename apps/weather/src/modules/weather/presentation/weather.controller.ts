import { Inject } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { WEATHER_DI_TOKENS } from '../constants/di-tokens';
import { WeatherServiceInterface } from '../application/services/interfaces/weather.service.interface';
import {
  GetWeatherRequest,
  GetWeatherResponse,
  IsCityValidRequest,
  IsCityValidResponse,
} from '@generated/weather';
import { GRPC_WEATHER_SERVICE, WeatherServiceMethods } from '../constants/grpc-methods';

@GrpcService()
export class WeatherController {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: WeatherServiceInterface,
  ) {}

  @GrpcMethod(GRPC_WEATHER_SERVICE, WeatherServiceMethods.GET_WEATHER)
  async getWeather (request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(request.city);
  }

  @GrpcMethod(GRPC_WEATHER_SERVICE, WeatherServiceMethods.IS_CITY_VALID)
  async isCityValid (request: IsCityValidRequest): Promise<IsCityValidResponse> {
    const isValid = await this.weatherService.isCityValid(request.city);

    return { isValid };
  }
}
