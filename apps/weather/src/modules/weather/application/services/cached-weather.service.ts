import { Inject, Injectable } from '@nestjs/common';
import { REDIS_DI_TOKENS } from '@utils/modules/redis/di-tokens';
import { RedisServiceInterface } from '@utils/modules/redis/interfaces/redis.service.interface';
import { WeatherServiceInterface } from './interfaces/weather.service.interface';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { WEATHER_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { IWeatherConfigService } from '../../../config/interfaces/weather-config.service.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

@Injectable()
export class CachedWeatherService implements WeatherServiceInterface {
  constructor (
    @Inject(WEATHER_DI_TOKENS.BASE_WEATHER_SERVICE)
    private readonly service: WeatherServiceInterface,

    @Inject(WEATHER_CONFIG_DI_TOKENS.WEATHER_CONFIG_SERVICE)
    private readonly configService: IWeatherConfigService,

    @Inject(REDIS_DI_TOKENS.REDIS_SERVICE)
    private readonly cache: RedisServiceInterface,

    @Inject(LOGGER_DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
  ) {
  }

  async getWeather (city: string): Promise<GetWeatherResponse> {
    const key = this.getCacheKey(city);
    const cachedData = await this.cache.get<GetWeatherResponse>(key);
    if (cachedData) {
      this.logger.debug(`Cache hit for "${city}"`, {
        context: this.constructor.name,
        method: this.getWeather.name,
      });

      return cachedData;
    }

    this.logger.debug(`Cache miss for "${city}". Fetching from base service.`, {
      context: this.constructor.name,
      method: this.getWeather.name,
    });
    const weatherData = await this.service.getWeather(city);

    this.logger.debug(`Caching weather data for "${city}" with TTL ${this.getCacheTtl()}s`, {
      context: this.constructor.name,
      method: this.getWeather.name,
      data: weatherData,
    });
    await this.cache.set(key, weatherData, this.getCacheTtl());

    return weatherData;
  }

  async isCityValid (city: string): Promise<boolean> {
    const key = this.getValidCityCacheKey(city);
    const cached = await this.cache.get<boolean>(key);
    if (cached !== null) {
      this.logger.debug(`Cache hit for valid city check: "${city}"`, {
        context: this.constructor.name,
        method: this.isCityValid.name,
      });

      return cached;
    }

    this.logger.debug(`Cache miss for valid city check: "${city}"`, {
      context: this.constructor.name,
      method: this.isCityValid.name,
    });
    const valid = await this.service.isCityValid(city);

    this.logger.debug(`Caching valid city check for "${city}" with TTL ${this.getCacheTtl()}s`, {
      context: this.constructor.name,
      method: this.isCityValid.name,
    });
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
