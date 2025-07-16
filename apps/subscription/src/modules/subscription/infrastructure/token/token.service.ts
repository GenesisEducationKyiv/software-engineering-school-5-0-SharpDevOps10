import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../../../config/di-tokens';
import { ISubscriptionConfigService } from '../../../config/interfaces/subscription-config.service.interface';
import { ITokenService } from '../../application/interfaces/token.service.interface';
import { TOKEN_DATE } from './constants/token.date';

@Injectable()
export class TokenService implements ITokenService {
  constructor (
    @Inject(SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE)
    private readonly configService: ISubscriptionConfigService,
  ) {}

  generateToken (): string {
    return randomUUID();
  }

  isTokenExpired (createdAt: Date): boolean {
    const now = Date.now();
    const expirationTime = new Date(createdAt).getTime();
    const ttlMilliseconds = this.configService.getTokenTtlHours() * TOKEN_DATE.MS_PER_HOUR;

    return now - expirationTime > ttlMilliseconds;
  }
}
