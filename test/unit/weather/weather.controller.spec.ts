import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@modules/app/app.module';
import * as request from 'supertest';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { IWeatherMapper } from '@modules/weather/interfaces/weather.mapper.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import { PrismaService } from '@database/prisma.service';

describe('WeatherController', () => {
  let app: INestApplication;

  const weatherApiClientMock: jest.Mocked<IWeatherApiClient> = {
    getWeatherData: jest.fn(),
  };

  const weatherMapperMock: jest.Mocked<IWeatherMapper> = {
    mapToGetWeatherResponse: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WEATHER_DI_TOKENS.WEATHER_API_CLIENT)
      .useValue(weatherApiClientMock)
      .overrideProvider(WEATHER_DI_TOKENS.WEATHER_MAPPER)
      .useValue(weatherMapperMock)
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

    const mockApiResponse: WeatherApiResponse = {
      current: {
        last_updated_epoch: 1750321800,
        last_updated: '2025-06-19 10:30',
        temp_c: 15,
        temp_f: 59,
        is_day: 1,
        condition: { text: 'Sunny', icon: '', code: 1000 },
        wind_mph: 5,
        wind_kph: 8,
        wind_degree: 90,
        wind_dir: 'E',
        pressure_mb: 1012,
        pressure_in: 30,
        precip_mm: 0,
        precip_in: 0,
        humidity: 60,
        cloud: 0,
        feelslike_c: 15,
        feelslike_f: 59,
        windchill_c: 15,
        windchill_f: 59,
        heatindex_c: 15,
        heatindex_f: 59,
        dewpoint_c: 8,
        dewpoint_f: 46,
        vis_km: 10,
        vis_miles: 6,
        uv: 3,
        gust_mph: 7,
        gust_kph: 12,
      },
      location: {
        name: city,
        region: 'Ile-de-France',
        country: 'France',
        lat: 48.8667,
        lon: 2.3333,
        tz_id: 'Europe/Paris',
        localtime_epoch: 1750322281,
        localtime: '2025-06-19 10:38',
      },
    };

    const mockResponse: GetWeatherResponse = {
      temperature: 15,
      humidity: 60,
      description: 'Sunny',
    };

    weatherApiClientMock.getWeatherData.mockResolvedValue(mockApiResponse);
    weatherMapperMock.mapToGetWeatherResponse.mockReturnValue(mockResponse);

    const res = await request(app.getHttpServer()).get(`/weather?city=${city}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse);
  });

  it('GET /weather?city=InvalidCity - should return 404', async () => {
    weatherApiClientMock.getWeatherData.mockRejectedValue(new NotFoundException('City not found'));

    const res = await request(app.getHttpServer()).get('/weather?city=InvalidCity');

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('City not found');
  });
});
