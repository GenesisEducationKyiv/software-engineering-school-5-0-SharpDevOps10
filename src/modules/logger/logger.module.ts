import { Module } from '@nestjs/common';
import { LoggerService } from '@logger/logger.service';
import { LOGGER_DI_TOKENS } from '@logger/di-tokens';

@Module({
  providers: [
    {
      provide: LOGGER_DI_TOKENS.LOGGER_SERVICE,
      useClass: LoggerService,
    },
  ],
  exports: [LOGGER_DI_TOKENS.LOGGER_SERVICE],
})
export class LoggerModule {}
