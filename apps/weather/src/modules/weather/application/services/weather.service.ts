import { Injectable, Inject } from '@nestjs/common';
import type { IWeatherService } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { IWeatherHandler } from '../handlers/interfaces/weather-handler.interface';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RpcError } from '@grpc-types/grpc-error.type';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.WEATHER_HANDLER)
    private readonly handler: IWeatherHandler,
  ) {}

  async getWeather (city: string): Promise<GetWeatherResponse> {
    return this.handler.handle(city);
  }

  async isCityValid (city: string): Promise<boolean> {
    try {
      await this.getWeather(city);

      return true;
    } catch (error) {
      if (
        error instanceof RpcException &&
        (error.getError() as RpcError)?.code === status.NOT_FOUND
      ) {
        return false;
      }
      throw error;
    }
  }
}
