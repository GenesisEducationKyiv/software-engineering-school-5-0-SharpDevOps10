import { VisualCrossingResponse } from '../../responses/visual-crossing.response';
import { GetWeatherResponse } from '@grpc-types/get-weather.response';

export interface IVisualCrossingMapper {
  mapToGetWeatherResponse(apiResponse: VisualCrossingResponse): GetWeatherResponse
}
