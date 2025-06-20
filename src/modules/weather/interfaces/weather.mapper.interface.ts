import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';

export interface IWeatherMapper {
  mapToGetWeatherResponse(apiResponse: WeatherApiResponse): GetWeatherResponse
}
