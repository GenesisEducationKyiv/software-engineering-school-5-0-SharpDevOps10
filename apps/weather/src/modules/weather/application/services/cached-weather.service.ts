import { Inject, Injectable } from '@nestjs/common';
import { REDIS_DI_TOKENS } from '@utils/modules/redis/di-tokens';
import { IRedisService } from '@utils/modules/redis/interfaces/redis.service.interface';
import { IWeatherService } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { WEATHER_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { IWeatherConfigService } from '../../../config/interfaces/weather-config.service.interface';
import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';

@Injectable()
export class CachedWeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.BASE_WEATHER_SERVICE)
    private readonly service: IWeatherService,

    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly configService: IWeatherConfigService,

    @Inject(REDIS_DI_TOKENS.REDIS_SERVICE)
    private readonly cache: IRedisService,
  ) {
  }

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const key = this.getCacheKey(city);
    const cachedData = await this.cache.get<GetWeatherResponse>(key);
    if (cachedData) return cachedData;

    const weatherData = await this.service.getWeather(city);
    await this.cache.set(key, weatherData, this.getCacheTtl());

    return weatherData;
  }

  async isCityValid (city: string): Promise<boolean> {
    const key = this.getValidCityCacheKey(city);
    const cached = await this.cache.get<boolean>(key);
    if (cached !== null) return cached;

    const valid = await this.service.isCityValid(city);
    await this.cache.set(key, valid, this.getCacheTtl());

    return valid;
  }

  private getCacheKey (city: string): string {
    return `weather:${city.toLowerCase()}`;
  }

  private getValidCityCacheKey (city: string): string {
    return `weather:valid:${city.toLowerCase()}`;
  }


  private getCacheTtl (): number {
    return this.configService.getRedisTtl();
  }
}
