import { IsCityValidRequest, IsCityValidResponse } from '@generated/weather';

export interface IsCityValidInterface {
  isCityValid(request: IsCityValidRequest): Promise<IsCityValidResponse>;
}
