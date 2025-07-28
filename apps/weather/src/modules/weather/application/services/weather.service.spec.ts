import { WeatherService } from './weather.service';
import { IWeatherHandler } from '../handlers/interfaces/weather-handler.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { WEATHER_DI_TOKENS } from '../../constants/di-tokens';
import { NotFoundRpcException } from '@exceptions/grpc-exceptions';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

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
    handlerMock.handle.mockRejectedValue(new NotFoundRpcException('City not found'));

    await expect(service.getWeather(city)).rejects.toThrow(NotFoundRpcException);
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

  it('should return true when getWeather succeeds', async () => {
    const city = 'ValidCity';
    handlerMock.handle.mockResolvedValue({
      temperature: 10,
      humidity: 50,
      description: 'Clear',
    });

    const result = await service.isCityValid(city);
    expect(result).toBe(true);
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });

  it('should return false when getWeather throws RpcException with NOT_FOUND code', async () => {
    const city = 'InvalidCity';
    const rpcError = new RpcException({ code: status.NOT_FOUND, message: 'Not found' });

    handlerMock.handle.mockRejectedValue(rpcError);

    const result = await service.isCityValid(city);
    expect(result).toBe(false);
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });

  it('should rethrow when getWeather throws an unexpected error', async () => {
    const city = 'AnyCity';
    const error = new Error('Something went wrong');
    handlerMock.handle.mockRejectedValue(error);

    await expect(service.isCityValid(city)).rejects.toThrow('Something went wrong');
    expect(handlerMock.handle).toHaveBeenCalledWith(city);
  });
});
