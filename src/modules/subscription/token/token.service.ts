import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TOKEN_DATE } from '@utils/constants/token.date';
import type { ITokenService } from '@subscription/interfaces/token.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';

@Injectable()
export class TokenService implements ITokenService {
  constructor (
    @Inject(SUBSCRIPTION_DI_TOKENS.TOKEN_TTL_HOURS)
    private readonly ttlHours: number,
  ) {}

  generateToken (): string {
    return randomUUID();
  }

  isTokenExpired (createdAt: Date): boolean {
    const now = Date.now();
    const expirationTime = new Date(createdAt).getTime();
    const ttlMilliseconds = this.ttlHours * TOKEN_DATE.MS_PER_HOUR;

    return now - expirationTime > ttlMilliseconds;
  }
}
