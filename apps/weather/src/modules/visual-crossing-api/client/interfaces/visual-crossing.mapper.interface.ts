import { GetWeatherResponse } from '@shared-types/grpc/common/get-weather.response';
import { VisualCrossingResponse } from '../../responses/visual-crossing.response';

export interface IVisualCrossingMapper {
  mapToGetWeatherResponse(apiResponse: VisualCrossingResponse): GetWeatherResponse
}
