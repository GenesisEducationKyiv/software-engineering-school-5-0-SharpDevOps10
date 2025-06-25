import { IWeatherService } from '@weather/interfaces/weather.service.interface';
import { server } from '../../setup-msw';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WeatherModule } from '@weather/weather.module';
import { WeatherService } from '@modules/weather/weather.service';

describe('WeatherService (integration)', () => {
  let service: IWeatherService;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
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
