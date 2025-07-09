import { WeatherService } from '@weather/application/services/weather.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { NotFoundException } from '@nestjs/common';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { IWeatherHandler } from '@weather/application/handlers/interfaces/weather-handler.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let handlerMock: jest.Mocked<IWeatherHandler>;

  beforeEach(async () => {
    const mockHandler: jest.Mocked<IWeatherHandler> = {
      setNext: jest.fn(),
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WEATHER_DI_TOKENS.WEATHER_HANDLER,
          useValue: mockHandler,
        },
      ],
    }).compile();
    service = module.get<WeatherService>(WeatherService);
    handlerMock = module.get(WEATHER_DI_TOKENS.WEATHER_HANDLER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather data transformed to GetWeatherResponse', async () => {
    const city = 'London';

    const expected: GetWeatherResponse = {
      temperature: 22.5,
      humidity: 60,
      description: 'Sunny',
    };

    handlerMock.handle.mockResolvedValue(expected);

    const result = await service.getWeather(city);

    expect(result).toEqual(expected);
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });

  it('should throw if handler throws NotFoundException', async () => {
    const city = 'InvalidCity';
    handlerMock.handle.mockRejectedValue(new NotFoundException('City not found'));

    await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });

  it('should rethrow unexpected errors from handler', async () => {
    const city = 'Kyiv';
    const error = new Error('Unexpected error');
    handlerMock.handle.mockRejectedValue(error);

    await expect(service.getWeather(city)).rejects.toThrow('Unexpected error');
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });

  it('should return correct description from handler', async () => {
    const city = 'Lviv';
    const expected: GetWeatherResponse = {
      temperature: 15,
      humidity: 80,
      description: 'Cloudy',
    };

    handlerMock.handle.mockResolvedValue(expected);

    const result = await service.getWeather(city);

    expect(result.description).toBe('Cloudy');
  });
});
