import { IConfigService } from '@shared/interfaces/config.service.interface';

export const configServiceMock: jest.Mocked<IConfigService> = {
  getTokenTtlHours: jest.fn().mockReturnValue(1),
  getWeatherApiKey: jest.fn().mockReturnValue('test-weather-api-key'),
  getWeatherApiBaseUrl: jest.fn().mockReturnValue('https://api.weather.com'),
  getVisualCrossingApiKey: jest.fn().mockReturnValue('test-visual-crossing-api-key'),
  getVisualCrossingBaseUrl: jest.fn().mockReturnValue('https://api.visualcrossing.com'),
  getWeatherProvidersPriority: jest.fn().mockReturnValue(['WEATHER_API', 'VISUAL_CROSSING']),
  getRedisTtl: jest.fn().mockReturnValue(600),
  getRedisPort: jest.fn().mockReturnValue(6379),
  getRedisHost: jest.fn().mockReturnValue('localhost'),
};
