import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '@shared-types/grpc/common/grpc-to-observable';
import {
  GetWeatherResponse,
  IsCityValidRequest,
  IsCityValidResponse,
  WeatherService,
} from '@generated/weather';
import { GetWeatherClientInterface } from './interfaces/get-weather.interface';
import { IsCityValidInterface } from './interfaces/is-city-valid.interface';

@Injectable()
export class WeatherClientService implements
  GetWeatherClientInterface,
  IsCityValidInterface,
  OnModuleInit {
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

  async isCityValid (request: IsCityValidRequest): Promise<IsCityValidResponse> {
    return await lastValueFrom(this.weatherClient.IsCityValid(request));
  }
}
