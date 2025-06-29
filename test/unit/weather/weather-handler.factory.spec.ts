import { WeatherHandlerFactory } from '@weather/factories/weather-handler.factory';
import { WeatherApiHandler } from '@weather/handlers/weather-api.handler';
import { VisualCrossingHandler } from '@weather/handlers/visual-crossing.handler';
import { IConfigService } from '@config/config.service.interface';
import { WeatherProviderEnum } from '@weather/enums/weather.provider.enum';

describe('WeatherHandlerFactory', () => {
  let factory: WeatherHandlerFactory;

  const weatherApiHandlerMock = {
    setNext: jest.fn().mockReturnThis(),
  } as unknown as WeatherApiHandler;

  const visualCrossingHandlerMock = {
    setNext: jest.fn().mockReturnThis(),
  } as unknown as VisualCrossingHandler;

  const configMock = {
    getWeatherProvidersPriority: jest.fn(),
  } as unknown as IConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    factory = new WeatherHandlerFactory(
      weatherApiHandlerMock,
      visualCrossingHandlerMock,
      configMock,
    );
  });

  it('should link handlers in the order from config', () => {
    configMock.getWeatherProvidersPriority = jest
      .fn()
      .mockReturnValue([WeatherProviderEnum.WEATHER_API, WeatherProviderEnum.VISUAL_CROSSING]);

    const result = factory.createChain();

    expect(weatherApiHandlerMock.setNext).toHaveBeenCalledWith(visualCrossingHandlerMock);
    expect(result).toBe(weatherApiHandlerMock);
  });

  it('should reverse the order and call setNext accordingly', () => {
    configMock.getWeatherProvidersPriority = jest
      .fn()
      .mockReturnValue([WeatherProviderEnum.VISUAL_CROSSING, WeatherProviderEnum.WEATHER_API]);

    const result = factory.createChain();

    expect(visualCrossingHandlerMock.setNext).toHaveBeenCalledWith(weatherApiHandlerMock);
    expect(result).toBe(visualCrossingHandlerMock);
  });

  it('should throw an error if config contains unknown provider', () => {
    configMock.getWeatherProvidersPriority = jest
      .fn()
      .mockReturnValue(['UNKNOWN_PROVIDER']);

    expect(() => factory.createChain()).toThrow(/Unknown provider/);
  });

  it('should throw an error if priority list is empty', () => {
    configMock.getWeatherProvidersPriority = jest.fn().mockReturnValue([]);

    expect(() => factory.createChain()).toThrow('No weather providers configured');
  });
});
