import { IsCityValidRequest, IsCityValidResponse } from '@generated/weather';

export interface IWeatherClient {
  isCityValid(request: IsCityValidRequest): Promise<IsCityValidResponse>;
}
