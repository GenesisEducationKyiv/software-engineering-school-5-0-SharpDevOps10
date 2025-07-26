import { GetWeatherResponse } from '@shared-types/common/get-weather.response';
import { VisualCrossingResponse } from '../../responses/visual-crossing.response';

export interface IVisualCrossingMapper {
  mapToGetWeatherResponse(apiResponse: VisualCrossingResponse): GetWeatherResponse
}
