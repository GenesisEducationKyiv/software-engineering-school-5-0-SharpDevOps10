import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IConfigService } from './config.service.interface';

@Injectable()
export class ConfigService implements IConfigService {
  constructor (private readonly config: NestConfigService) {}

  getTokenTtlHours (): number {
    return this.config.get<number>('TOKEN_TTL_HOURS');
  }

  getWeatherApiKey (): string {
    return this.config.getOrThrow<string>('WEATHER_API_KEY');
  }

  getWeatherApiBaseUrl (): string {
    return this.config.getOrThrow<string>('WEATHER_API_BASE_URL');
  }

  getVisualCrossingApiKey (): string {
    return this.config.getOrThrow<string>('VISUAL_CROSSING_API_KEY');
  }

  getVisualCrossingBaseUrl (): string {
    return this.config.getOrThrow<string>('VISUAL_CROSSING_BASE_URL');
  }

  getWeatherProvidersPriority (): string[] {
    const priority = this.config.getOrThrow<string>('WEATHER_PROVIDERS_PRIORITY');

    return priority.split(',').map((item) => item.trim());
  }
}
