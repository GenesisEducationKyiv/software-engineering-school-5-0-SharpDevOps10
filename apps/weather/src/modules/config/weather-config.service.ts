import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { WeatherConfigServiceInterface } from './interfaces/weather-config.service.interface';

@Injectable()
export class WeatherConfigService implements WeatherConfigServiceInterface {
  constructor (private readonly config: NestConfigService) {}

  getPort (): number {
    return this.config.get<number>('PORT', 3002);
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

  getRedisTtl (): number {
    return this.config.getOrThrow<number>('REDIS_TTL');
  }

  getPushGatewayUrl (): string {
    return this.config.getOrThrow<string>('PROMETHEUS_PUSH_GATEWAY_URL');
  }

  getMetricsJobName (): string {
    return this.config.getOrThrow<string>('PROMETHEUS_METRICS_JOB_NAME');
  }

  getMetricsPushInterval (): number {
    return this.config.getOrThrow<number>('PROMETHEUS_METRICS_PUSH_INTERVAL', 60000);
  }
}
