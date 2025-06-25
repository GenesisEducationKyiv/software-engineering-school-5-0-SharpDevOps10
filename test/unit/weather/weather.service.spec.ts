import { WeatherService } from '@weather/weather.service';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import { Test, TestingModule } from '@nestjs/testing';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { NotFoundException } from '@nestjs/common';
import type { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import type { IWeatherMapper } from '@weather-api/interfaces/weather.mapper.interface';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherApiClientMock: jest.Mocked<IWeatherApiClient>;
  let weatherMapperMock: jest.Mocked<IWeatherMapper>;

  beforeEach(async () => {
    const mockWeatherApiClient: jest.Mocked<IWeatherApiClient> = {
      getWeatherData: jest.fn(),
    };

    const mockWeatherMapper: jest.Mocked<IWeatherMapper> = {
      mapToGetWeatherResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WEATHER_DI_TOKENS.WEATHER_API_CLIENT,
          useValue: mockWeatherApiClient,
        },
        {
          provide: WEATHER_DI_TOKENS.WEATHER_MAPPER,
          useValue: mockWeatherMapper,
        },
      ],
    }).compile();
    service = module.get<WeatherService>(WeatherService);
    weatherApiClientMock = module.get(WEATHER_DI_TOKENS.WEATHER_API_CLIENT);
    weatherMapperMock = module.get(WEATHER_DI_TOKENS.WEATHER_MAPPER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return weather data transformed to GetWeatherResponse', async () => {
    const city = 'London';
    const mockApiResponse = {
      current: {
        temp_c: 22.5,
        humidity: 60,
        condition: {
          text: 'Sunny',
          icon: '',
          code: 1000,
        },
      },
      location: {},
    } as unknown as WeatherApiResponse;

    const expected: GetWeatherResponse = {
      temperature: 22.5,
      humidity: 60,
      description: 'Sunny',
    };

    weatherApiClientMock.getWeatherData.mockResolvedValue(expected);

    const result = await service.getWeather(city);

    expect(result).toEqual(expected);
    expect(weatherApiClientMock.getWeatherData).toHaveBeenCalledWith(city);
  });

  it('should throw if weatherApiClient throws NotFoundException', async () => {
    const city = 'InvalidCity';
    weatherApiClientMock.getWeatherData.mockRejectedValue(new NotFoundException('City not found'));

    await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
    expect(weatherApiClientMock.getWeatherData).toHaveBeenCalledWith(city);
  });

  it('should rethrow unexpected errors from weatherApiClient', async () => {
    const city = 'Kyiv';
    const error = new Error('Unexpected error');
    weatherApiClientMock.getWeatherData.mockRejectedValue(error);

    await expect(service.getWeather(city)).rejects.toThrow('Unexpected error');
    expect(weatherApiClientMock.getWeatherData).toHaveBeenCalledWith(city);
  });

  it('should map condition.text to description', async () => {
    const city = 'Lviv';

    const expected: GetWeatherResponse = {
      temperature: 15,
      humidity: 80,
      description: 'Cloudy',
    };

    weatherApiClientMock.getWeatherData.mockResolvedValue(expected);

    const result = await service.getWeather(city);

    expect(result.description).toBe('Cloudy');
  });
});
