import { VisualCrossingHandler } from './visual-crossing.handler';
import { IWeatherApiClient } from '../interfaces/weather-api.interface';
import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';
import { IWeatherHandler } from './interfaces/weather-handler.interface';

describe('VisualCrossingHandler', () => {
  let handler: VisualCrossingHandler;
  let mockClient: jest.Mocked<IWeatherApiClient>;

  beforeEach(() => {
    mockClient = {
      getWeatherData: jest.fn(),
    };

    handler = new VisualCrossingHandler(mockClient);
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

    const nextHandler: IWeatherHandler = {
      handle: jest.fn().mockResolvedValue('fallback-response'),
      setNext: jest.fn().mockReturnThis(),
    };

    handler.setNext(nextHandler);

    const result = await handler.handle('Lviv');

    expect(nextHandler.handle).toHaveBeenCalledWith('Lviv', error);
    expect(result).toBe('fallback-response');
  });
});
