import { IWeatherService } from '@weather/interfaces/weather.service.interface';
import { server } from '../../setup-msw';
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '@weather/weather.service';
import { WeatherApiClient } from '@weather-api/weather-api.client';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { NotFoundException } from '@nestjs/common';
import { WeatherApiMapper } from '@weather-api/mappers/weather-api.mapper';

describe('WeatherService (integration)', () => {
  let service: IWeatherService;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        WeatherApiClient,
        {
          provide: WEATHER_DI_TOKENS.WEATHER_API_CLIENT,
          useClass: WeatherApiClient,
        },
        {
          provide: WEATHER_DI_TOKENS.WEATHER_MAPPER,
          useClass: WeatherApiMapper,
        },
      ],
    }).compile();

    service = module.get(WeatherService);
  });

  it('should return transformed weather data from real API client', async () => {
    const city = 'Paris';

    const result = await service.getWeather(city);

    expect(result).toEqual({
      temperature: 24.1,
      humidity: 57,
      description: 'Sunny',
    });
  });

  it('should throw NotFoundException for invalid city', async () => {
    const city = 'InvalidCity';

    await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
  });
});
