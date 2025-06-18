import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ITokenService } from '@subscription/interfaces/token.service.interface';
import { TOKEN_DATE } from '@utils/date/token.date';

@Injectable()
export class TokenService implements ITokenService {

  generateToken (): string {
    return randomUUID();
  }

  isTokenExpired (createdAt: Date): boolean {
    const now = Date.now();
    const expirationTime = new Date(createdAt).getTime();
    const ttlMilliseconds = TOKEN_DATE.TTL_HOURS * TOKEN_DATE.MS_PER_HOUR;

    return now - expirationTime > ttlMilliseconds;
  }
}
