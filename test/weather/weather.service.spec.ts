import { WeatherService } from '@weather/weather.service';
import { IWeatherApiClient } from '@weather-api/interfaces/weather-api-client.interface';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import { Test, TestingModule } from '@nestjs/testing';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { NotFoundException } from '@nestjs/common';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherApiClientMock: jest.Mocked<IWeatherApiClient>;

  beforeEach(async () => {
    const mockWeatherApiClient: jest.Mocked<IWeatherApiClient> = {
      getWeatherData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: DI_TOKENS.WEATHER_API_CLIENT,
          useValue: mockWeatherApiClient,
        },
      ],
    }).compile();
    service = module.get<WeatherService>(WeatherService);
    weatherApiClientMock = module.get(DI_TOKENS.WEATHER_API_CLIENT);
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

    weatherApiClientMock.getWeatherData.mockResolvedValue(mockApiResponse);

    const result = await service.getWeather(city);

    const expected: GetWeatherResponse = {
      temperature: 22.5,
      humidity: 60,
      description: 'Sunny',
    };

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
    const mockApiResponse = {
      current: {
        temp_c: 15,
        humidity: 80,
        condition: {
          text: 'Cloudy',
          icon: '',
          code: 1003,
        },
      },
      location: {},
    } as unknown as WeatherApiResponse;

    weatherApiClientMock.getWeatherData.mockResolvedValue(mockApiResponse);

    const result = await service.getWeather(city);

    expect(result.description).toBe('Cloudy');
  });
});
