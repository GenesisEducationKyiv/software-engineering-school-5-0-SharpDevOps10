import { IWeatherService } from '@weather/interfaces/weather.service.interface';
import { server } from '../../setup-msw';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { WeatherModule } from '@weather/weather.module';
import { WeatherService } from '@weather/services/weather.service';
import { IWeatherApiClient } from '@modules/weather/interfaces/weather-api.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import * as fs from 'node:fs/promises';

describe('WeatherService (integration)', () => {
  let service: IWeatherService;
  let spyAppendFile: jest.SpyInstance;
  let app: INestApplication;
  let spyMkdir: jest.SpyInstance;

  let visualCrossingClient: IWeatherApiClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(async () => {
    await app.close();
    server.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get(WeatherService);
    visualCrossingClient = module.get(WEATHER_DI_TOKENS.VISUAL_CROSSING_CLIENT);

    jest.spyOn(visualCrossingClient, 'getWeatherData');
    spyAppendFile = jest.spyOn(fs, 'appendFile').mockResolvedValue(undefined);
    spyMkdir = jest.spyOn(fs, 'mkdir').mockImplementation(undefined);
  });

  it('should return transformed weather data from weather api client', async () => {
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

  it('should fallback to VisualCrossing if WeatherApi fails', async () => {
    const city = 'Warsaw';

    const result = await service.getWeather(city);

    expect(result).toEqual({
      temperature: 23,
      humidity: 60,
      description: 'Partly Cloudy',
    });
  });

  it('should throw ServiceUnavailableException if all providers fail unexpectedly', async () => {
    const city = 'FailsEverywhere';

    await expect(service.getWeather(city)).rejects.toThrow(ServiceUnavailableException);
  });

  it('should not fallback to VisualCrossing if WeatherApi succeeds', async () => {
    const city = 'Paris';

    const result = await service.getWeather(city);

    expect(result).toEqual({
      temperature: 24.1,
      humidity: 57,
      description: 'Sunny',
    });

    expect(visualCrossingClient.getWeatherData).not.toHaveBeenCalled();
  });

  it('should log response from successful provider call', async () => {
    const city = 'Paris';

    await service.getWeather(city);

    expect(spyMkdir).toHaveBeenCalledWith(expect.stringContaining('logs'), { recursive: true });
    expect(spyAppendFile).toHaveBeenCalledWith(
      expect.stringContaining('logs/provider.log'),
      expect.stringContaining('Response:'),
    );
  });

  it('should log error if provider fails', async () => {
    const city = 'InvalidCity';

    await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);

    expect(spyAppendFile).toHaveBeenCalledWith(
      expect.stringContaining('logs/provider.log'),
      expect.stringMatching(/Error: NotFoundException:/),
    );
  });
});
