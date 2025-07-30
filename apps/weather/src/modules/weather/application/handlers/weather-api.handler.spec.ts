import { WeatherApiHandler } from './weather-api.handler';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { WeatherHandlerInterface } from './interfaces/weather-handler.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

describe('WeatherApiHandler', () => {
  let handler: WeatherApiHandler;
  let mockClient: jest.Mocked<IWeatherApiClient>;

  const mockResponse: GetWeatherResponse = {
    temperature: 25,
    humidity: 60,
    description: 'Clear',
  };

  const mockLogger: jest.Mocked<LoggerServiceInterface> = {
    setContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    mockClient = {
      getWeatherData: jest.fn(),
    };


    handler = new WeatherApiHandler(mockClient, mockLogger);
  });

  it('should return weather data if client succeeds', async () => {
    mockClient.getWeatherData.mockResolvedValue(mockResponse);

    const result = await handler.handle('Kyiv');

    expect(result).toEqual(mockResponse);
    expect(mockClient.getWeatherData).toHaveBeenCalledWith('Kyiv');
  });

  it('should call next handler if client fails', async () => {
    const error = new Error('API failure');
    mockClient.getWeatherData.mockRejectedValue(error);

    const nextHandler: WeatherHandlerInterface = {
      handle: jest.fn().mockResolvedValue('next-response'),
      setNext: jest.fn().mockReturnThis(),
    };

    handler.setNext(nextHandler);

    const result = await handler.handle('Lviv');

    expect(nextHandler.handle).toHaveBeenCalledWith('Lviv', error);
    expect(result).toBe('next-response');
  });
});
