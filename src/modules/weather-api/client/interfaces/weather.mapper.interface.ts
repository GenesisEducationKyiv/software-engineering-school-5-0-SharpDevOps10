import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';

export interface IWeatherMapper {
  mapToGetWeatherResponse(apiResponse: WeatherApiResponse): GetWeatherResponse
}
