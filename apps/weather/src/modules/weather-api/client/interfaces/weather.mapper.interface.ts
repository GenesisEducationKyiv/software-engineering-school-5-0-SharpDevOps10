import { WeatherApiResponse } from '../../responses/weather-api.response';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';;

export interface IWeatherMapper {
  mapToGetWeatherResponse(apiResponse: WeatherApiResponse): GetWeatherResponse
}
