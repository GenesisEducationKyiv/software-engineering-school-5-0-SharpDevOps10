import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WeatherController } from './weather.controller';
import { WEATHER_DI_TOKENS } from './di-tokens';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import { WeatherService } from './weather.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GATEWAY_CLIENT_DI_TOKENS } from '../clients/di-tokens';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { RpcToHttpExceptionFilter } from '../../filters/rpc-to-http-exception.filter';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

describe('WeatherController', () => {
  let app: INestApplication;

  const weatherClientMock: jest.Mocked<WeatherServiceInterface> = {
    getWeather: jest.fn(),
  };

  const loggerMock: jest.Mocked<LoggerServiceInterface> = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WEATHER_DI_TOKENS.WEATHER_SERVICE,
          useClass: WeatherService,
        },
        {
          provide: GATEWAY_CLIENT_DI_TOKENS.WEATHER_CLIENT,
          useValue: weatherClientMock,
        },
        {
          provide: LOGGER_DI_TOKENS.LOGGER_SERVICE,
          useValue: loggerMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new RpcToHttpExceptionFilter(),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /weather?city=Paris - should return weather data from weather service', async () => {
    weatherClientMock.getWeather.mockResolvedValueOnce({
      temperature: 25,
      humidity: 60,
      description: 'Sunny',
    });

    const res = await request(app.getHttpServer()).get('/weather?city=Paris');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      temperature: 25,
      humidity: 60,
      description: 'Sunny',
    });

    expect(weatherClientMock.getWeather).toHaveBeenCalledWith('Paris');
  });

  it('GET /weather?city=InvalidCity - should return 404 from weather service', async () => {
    const GRPC_NOT_FOUND = 5;
    const error = Object.assign(new Error('City not found'), {
      code: GRPC_NOT_FOUND,
    });

    weatherClientMock.getWeather?.mockRejectedValueOnce(error);

    const res = await request(app.getHttpServer()).get('/weather?city=InvalidCity');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('City not found');
  });
});
