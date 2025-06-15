import { Module } from '@nestjs/common';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import { LoggerService } from '@logger/logger.service';

@Module({
  providers: [
    {
      provide: DI_TOKENS.LOGGER_SERVICE,
      useClass: LoggerService,
    },
  ],
  exports: [DI_TOKENS.LOGGER_SERVICE],
})
export class LoggerModule {}
