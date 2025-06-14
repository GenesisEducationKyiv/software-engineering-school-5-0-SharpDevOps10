import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ITokenService } from '@subscription/interfaces/token.service.interface';

@Injectable()
export class TokenService implements ITokenService {
  private readonly ttlHours = 24;

  generateToken (): string {
    return randomUUID();
  }

  isTokenExpired (createdAt: Date): boolean {
    const MS_PER_HOUR = 60 * 60 * 1000;

    const now = Date.now();
    const expirationTime = new Date(createdAt).getTime();
    const ttlMilliseconds = this.ttlHours * MS_PER_HOUR;

    return now - expirationTime > ttlMilliseconds;
  }
}
