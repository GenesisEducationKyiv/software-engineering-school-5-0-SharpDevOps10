import { Injectable } from '@nestjs/common';
import { IWeatherMapper } from '../client/interfaces/weather.mapper.interface';
import { WeatherApiResponse } from '../responses/weather-api.response';
import { GetWeatherResponse } from '@shared-types/common/get-weather.response';

@Injectable()
export class WeatherApiMapper implements IWeatherMapper {
  mapToGetWeatherResponse (apiResponse: WeatherApiResponse): GetWeatherResponse {
    return {
      temperature: apiResponse.current.temp_c,
      humidity: apiResponse.current.humidity,
      description: apiResponse.current.condition.text,
    };
  }
}
