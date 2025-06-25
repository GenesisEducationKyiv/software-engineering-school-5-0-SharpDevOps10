import { Injectable } from '@nestjs/common';
import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { IVisualCrossingMapper } from '../interfaces/visual-crossing.mapper.interface';
import { VisualCrossingResponse } from '@modules/visual-crossing-api/responses/visual-crossing.response';

@Injectable()
export class VisualCrossingMapper implements IVisualCrossingMapper {
  mapToGetWeatherResponse (apiResponse: VisualCrossingResponse): GetWeatherResponse {
    return {
      temperature: apiResponse.currentConditions.temp,
      humidity: apiResponse.currentConditions.humidity,
      description: apiResponse.currentConditions.conditions,
    };
  }
}
