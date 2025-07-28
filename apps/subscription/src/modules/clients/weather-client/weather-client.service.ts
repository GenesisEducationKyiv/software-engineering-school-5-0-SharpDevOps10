import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CLIENTS_PACKAGES } from '../clients.packages';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '@shared-types/grpc/common/grpc-to-observable';
import { IsCityValidRequest, IsCityValidResponse, WeatherService } from '@generated/weather';
import { IWeatherClient } from '../../subscription/application/interfaces/weather-client.interface';

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

  async isCityValid (request: IsCityValidRequest): Promise<IsCityValidResponse> {
    return await lastValueFrom(this.weatherClient.IsCityValid(request));
  }
}
