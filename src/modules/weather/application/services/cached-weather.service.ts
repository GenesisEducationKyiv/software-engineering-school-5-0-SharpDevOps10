import { Inject, Injectable } from '@nestjs/common';
import { IWeatherService } from '@weather/application/services/interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { CONFIG_DI_TOKENS } from '@config/di-tokens';
import { IConfigService } from '@shared/interfaces/config.service.interface';
import { REDIS_DI_TOKENS } from '@redis/di-tokens';
import { IRedisService } from '@shared/interfaces/redis.service.interface';

@Injectable()
export class CachedWeatherService implements IWeatherService {
  constructor (
    @Inject(WEATHER_DI_TOKENS.BASE_WEATHER_SERVICE)
    private readonly service: IWeatherService,

    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly configService: IConfigService,

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

  private getCacheKey (city: string): string {
    return `weather:${city.toLowerCase()}`;
  }

  private getCacheTtl (): number {
    return this.configService.getRedisTtl();
  }
}
