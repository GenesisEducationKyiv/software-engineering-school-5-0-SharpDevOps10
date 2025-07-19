import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IWeatherClient } from '../../notification/application/interfaces/weather.client.interface';
import { GrpcToObservable } from '@shared-types/common/grpc-to-observable';
import { GetWeatherResponse, WeatherService } from '@generated/weather';

@Injectable()
export class WeatherClientService implements IWeatherClient, OnModuleInit {
  private weatherClient: GrpcToObservable<WeatherService>;

  constructor (
    @Inject(CLIENTS_PACKAGES.WEATHER_PACKAGE)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit (): void {
    this.weatherClient = this.client.getService<WeatherService>('WeatherService');
  }

  async getWeather (city: string): Promise<GetWeatherResponse> {
    return await lastValueFrom(this.weatherClient.GetWeather({ city }));
  }
}
