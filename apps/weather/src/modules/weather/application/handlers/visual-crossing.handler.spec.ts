import { VisualCrossingHandler } from './visual-crossing.handler';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { WeatherHandlerInterface } from './interfaces/weather-handler.interface';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';

describe('VisualCrossingHandler', () => {
  let handler: VisualCrossingHandler;
  let mockClient: jest.Mocked<IWeatherApiClient>;

  const mockLogger: jest.Mocked<LoggerServiceInterface> = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };


  beforeEach(() => {
    mockClient = {
      getWeatherData: jest.fn(),
    };

    handler = new VisualCrossingHandler(mockClient, mockLogger);
  });

  it('should return weather data from client', async () => {
    const mockResponse: GetWeatherResponse = {
      temperature: 23,
      humidity: 60,
      description: 'Partly Cloudy',
    };

    mockClient.getWeatherData.mockResolvedValue(mockResponse);

    const result = await handler.handle('Kyiv');

    expect(result).toEqual(mockResponse);
    expect(mockClient.getWeatherData).toHaveBeenCalledWith('Kyiv');
  });

  it('should call next handler if client fails', async () => {
    const error = new Error('API failure');
    mockClient.getWeatherData.mockRejectedValue(error);

    const nextHandler: WeatherHandlerInterface = {
      handle: jest.fn().mockResolvedValue('fallback-response'),
      setNext: jest.fn().mockReturnThis(),
    };

    handler.setNext(nextHandler);

    const result = await handler.handle('Lviv');

    expect(nextHandler.handle).toHaveBeenCalledWith('Lviv', error);
    expect(result).toBe('fallback-response');
  });
});
