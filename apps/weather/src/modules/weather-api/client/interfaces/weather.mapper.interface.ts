import { WeatherApiResponse } from '../../responses/weather-api.response';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

export interface IWeatherMapper {
  mapToGetWeatherResponse(apiResponse: WeatherApiResponse): GetWeatherResponse
}
