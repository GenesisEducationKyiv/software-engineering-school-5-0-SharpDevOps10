import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@modules/app/app.module';
import * as request from 'supertest';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { PrismaService } from '@database/prisma.service';
import { IWeatherHandler } from '@weather/application/handlers/interfaces/weather-handler.interface';
import { IRedisService } from '@shared/interfaces/redis.service.interface';
import { REDIS_DI_TOKENS } from '@redis/di-tokens';

jest.mock('ioredis', () => {
  const mRedis = jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
  }));

  return { __esModule: true, default: mRedis };
});

describe('WeatherController', () => {
  let app: INestApplication;

  const weatherHandlerMock: jest.Mocked<IWeatherHandler> = {
    setNext: jest.fn(),
    handle: jest.fn(),
  };

  const redisMock: jest.Mocked<IRedisService> = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WEATHER_DI_TOKENS.WEATHER_HANDLER)
      .useValue(weatherHandlerMock)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
      .overrideProvider(REDIS_DI_TOKENS.REDIS_SERVICE)
      .useValue(redisMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /weather?city=Paris - should return weather data', async () => {
    const city = 'Paris';

    const mockResponse: GetWeatherResponse = {
      temperature: 15,
      humidity: 60,
      description: 'Sunny',
    };

    weatherHandlerMock.handle.mockResolvedValue(mockResponse);

    const res = await request(app.getHttpServer()).get(`/weather?city=${city}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });

  it('GET /weather?city=InvalidCity - should return 404', async () => {
    weatherHandlerMock.handle.mockRejectedValue(new NotFoundException('City not found'));

    const res = await request(app.getHttpServer()).get('/weather?city=InvalidCity');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('City not found');
  });

  it('returns cached data when Redis contains key', async () => {
    const city = 'Paris';

    const mockResponse: GetWeatherResponse = {
      temperature: 15,
      humidity: 60,
      description: 'Sunny',
    };

    const key = `weather:${city.toLowerCase()}`;

    redisMock.get.mockResolvedValue(mockResponse);
    weatherHandlerMock.handle.mockResolvedValue(mockResponse);

    const res = await request(app.getHttpServer()).get(`/weather?city=${city}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
    expect(redisMock.get).toHaveBeenCalledWith(key);
    expect(weatherHandlerMock.handle).not.toHaveBeenCalled();
    expect(redisMock.set).not.toHaveBeenCalled();
  });

  it('calls API and stores in cache on miss', async () => {
    const city = 'London';

    const mockResponse: GetWeatherResponse = {
      temperature: 10,
      humidity: 80,
      description: 'Rainy',
    };

    const key = `weather:${city.toLowerCase()}`;
    const ttl = 600;

    redisMock.get.mockResolvedValue(null);
    weatherHandlerMock.handle.mockResolvedValue(mockResponse);

    const res = await request(app.getHttpServer()).get(`/weather?city=${city}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);

    expect(weatherHandlerMock.handle).toHaveBeenCalledWith(city);

    expect(redisMock.set).toHaveBeenCalledWith(
      key,
      mockResponse,
      ttl,
    );
  });
});
