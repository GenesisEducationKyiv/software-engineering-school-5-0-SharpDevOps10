import { Injectable } from '@nestjs/common';
import { WeatherApiResponse } from '@weather-api/responses/weather-api.response';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import type { IWeatherMapper } from '@weather-api/client/interfaces/weather.mapper.interface';

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
