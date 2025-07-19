import { GetWeatherResponse } from '@weather/responses/get-weather.response';
import { VisualCrossingResponse } from '@visual-crossing-api/responses/visual-crossing.response';

export interface IVisualCrossingMapper {
  mapToGetWeatherResponse(apiResponse: VisualCrossingResponse): GetWeatherResponse
}
