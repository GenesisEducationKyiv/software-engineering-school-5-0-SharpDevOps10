import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@modules/app/app.module';
import * as request from 'supertest';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { PrismaService } from '@database/prisma.service';
import { IWeatherHandler } from '@weather/interfaces/weather-handler.interface';

describe('WeatherController', () => {
  let app: INestApplication;

  const weatherHandlerMock: jest.Mocked<IWeatherHandler> = {
    setNext: jest.fn(),
    handle: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WEATHER_DI_TOKENS.WEATHER_HANDLER)
      .useValue(weatherHandlerMock)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn(), $disconnect: jest.fn() })
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
});
