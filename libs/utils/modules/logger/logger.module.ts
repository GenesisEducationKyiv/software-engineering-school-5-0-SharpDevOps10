import { Module } from '@nestjs/common';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerService } from '@utils/modules/logger/logger.service';

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
