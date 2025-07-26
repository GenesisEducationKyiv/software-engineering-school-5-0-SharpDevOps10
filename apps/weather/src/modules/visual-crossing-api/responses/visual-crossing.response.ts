import { CurrentConditions } from './current-condtions.response';

export class VisualCrossingResponse {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  currentConditions: CurrentConditions;
}
