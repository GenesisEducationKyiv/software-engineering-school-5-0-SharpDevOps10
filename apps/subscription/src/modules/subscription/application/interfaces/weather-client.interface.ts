import { IsCityValidRequest, IsCityValidResponse } from '@generated/weather';

export interface WeatherClientInterface {
  isCityValid(request: IsCityValidRequest): Promise<IsCityValidResponse>;
}
