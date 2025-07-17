import { Injectable } from '@nestjs/common';
import { IVisualCrossingMapper } from '../client/interfaces/visual-crossing.mapper.interface';
import { VisualCrossingResponse } from '../responses/visual-crossing.response';
import { GetWeatherResponse } from '../../weather/responses/get-weather.response';

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
