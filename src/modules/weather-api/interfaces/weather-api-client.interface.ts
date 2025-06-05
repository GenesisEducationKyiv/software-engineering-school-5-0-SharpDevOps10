import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<WeatherApiResponse>;
}
