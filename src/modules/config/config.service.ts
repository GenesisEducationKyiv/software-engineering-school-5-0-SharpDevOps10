import { Injectable } from '@nestjs/common';
import { IConfigService } from '@modules/config/config.service.interface';

@Injectable()
export class ConfigService implements IConfigService {
  getTokenTtlHours (): number {
    const value = process.env.TOKEN_TTL_HOURS;
    const parsed = Number(value);
    if (isNaN(parsed) || parsed <= 0) throw new Error('Invalid TOKEN_TTL_HOURS env variable');

    return parsed;
  }
}
