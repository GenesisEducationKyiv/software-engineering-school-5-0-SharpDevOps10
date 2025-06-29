import { IWeatherService } from '@weather/interfaces/weather.service.interface';
import { server } from '../../setup-msw';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WeatherModule } from '@weather/weather.module';
import { REDIS_DI_TOKENS } from '@modules/redis/di-tokens';
import Redis from 'ioredis';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IWeatherApiClient } from '@modules/weather/interfaces/weather-api.interface';

describe('CachedWeatherService (integration)', () => {
  let app: INestApplication;
  let redisClient: Redis;
  let service: IWeatherService;
  let weatherApiClient: IWeatherApiClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redisClient = app.get(REDIS_DI_TOKENS.REDIS_CLIENT);
    service = app.get<IWeatherService>(WEATHER_DI_TOKENS.WEATHER_SERVICE);
    weatherApiClient = app.get(WEATHER_DI_TOKENS.WEATHER_API_CLIENT);
    jest.spyOn(weatherApiClient, 'getWeatherData');
  });

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(async () => {
    await redisClient.flushall();
    try {
      if (redisClient.status === 'ready') {
        await redisClient.quit();
      }
    } finally {
      redisClient.disconnect();
    }
    server.resetHandlers();
  });

  afterAll(async () => {
    await app.close();
    server.close();
  });

  it('should return weather from API and then from Redis cache', async () => {
    const city = 'Paris';
    const cacheKey = `weather:${city.toLowerCase()}`;

    expect(await redisClient.get(cacheKey)).toBeNull();

    const result1 = await service.getWeather(city);
    expect(result1).toEqual({
      temperature: 24.1,
      humidity: 57,
      description: 'Sunny',
    });

    const cached = await redisClient.get(cacheKey);
    expect(cached).not.toBeNull();

    jest.clearAllMocks();

    const result2 = await service.getWeather(city);
    expect(result2).toEqual(result1);

    expect(weatherApiClient.getWeatherData).not.toHaveBeenCalled();
  });

  it('should call API again after cache is cleared', async () => {
    const city = 'Paris';

    jest.clearAllMocks();

    await service.getWeather(city);
    expect(weatherApiClient.getWeatherData).toHaveBeenCalledTimes(1);

    await redisClient.del(`weather:${city.toLowerCase()}`);

    await service.getWeather(city);
    expect(weatherApiClient.getWeatherData).toHaveBeenCalledTimes(2);
  });

  it('should not cache errors – NotFound', async () => {
    const city = 'InvalidCity';
    const key = `weather:${city.toLowerCase()}`;

    await expect(service.getWeather(city)).rejects.toThrow();

    const cached = await redisClient.get(key);
    expect(cached).toBeNull();
  });
});
