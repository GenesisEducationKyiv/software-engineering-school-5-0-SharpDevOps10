import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TOKEN_DATE } from '@utils/constants/token.date';
import type { ITokenService } from '@subscription/interfaces/token.service.interface';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';
import { IConfigService } from '@modules/config/config.service.interface';

@Injectable()
export class TokenService implements ITokenService {
  constructor (
    @Inject(CONFIG_DI_TOKENS.CONFIG_SERVICE)
    private readonly configService: IConfigService,
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
