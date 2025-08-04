import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerConfigServiceInterface } from './logger-config-service.interface';

@Injectable()
export class LoggerConfigService implements LoggerConfigServiceInterface {
  constructor (private readonly configService: ConfigService) {}

  get sampleRateInfo (): number {
    return parseFloat(this.configService.get('LOG_SAMPLE_RATE_INFO', '0.2'));
  }

  get sampleRateDebug (): number {
    return parseFloat(this.configService.get('LOG_SAMPLE_RATE_DEBUG', '0.3'));
  }

  get sampleRateWarn (): number {
    return parseFloat(this.configService.get('LOG_SAMPLE_RATE_WARN', '0.2'));
  }
}
