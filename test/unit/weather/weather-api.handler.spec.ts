import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { IWeatherApiClient } from '@weather/interfaces/weather-api.interface';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { IWeatherHandler } from '@weather/interfaces/weather-handler.interface';

describe('WeatherApiHandler', () => {
  let handler: WeatherApiHandler;
  let mockClient: jest.Mocked<IWeatherApiClient>;

  const mockResponse: GetWeatherResponse = {
    temperature: 25,
    humidity: 60,
    description: 'Clear',
  };

  beforeEach(() => {
    mockClient = {
      getWeatherData: jest.fn(),
    };

    handler = new WeatherApiHandler(mockClient);
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

    const nextHandler: IWeatherHandler = {
      handle: jest.fn().mockResolvedValue('next-response'),
      setNext: jest.fn().mockReturnThis(),
    };

    handler.setNext(nextHandler);

    const result = await handler.handle('Lviv');

    expect(nextHandler.handle).toHaveBeenCalledWith('Lviv', error);
    expect(result).toBe('next-response');
  });
});
