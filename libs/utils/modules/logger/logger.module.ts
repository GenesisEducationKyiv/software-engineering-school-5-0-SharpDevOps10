import { Module } from '@nestjs/common';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerService } from '@utils/modules/logger/logger.service';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerConfigService } from '@utils/modules/logger/configs/logger-config.service';

@Module({
  imports: [
    ConfigModule,
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService): Params => ({
        pinoHttp: {
          autoLogging: false,
          level: config.getOrThrow('NODE_ENV') === 'production' ? 'info' : 'debug',
          transport: config.get('NODE_ENV') === 'production'
            ? undefined
            : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
        },
      }),
    }),
  ],

  providers: [
    LoggerConfigService,
    {
      provide: LOGGER_DI_TOKENS.LOGGER_SERVICE,
      useClass: LoggerService,
    },
    {
      provide: LOGGER_DI_TOKENS.LOGGER_CONFIG_SERVICE,
      useClass: LoggerConfigService,
    },
  ],
  exports: [
    LOGGER_DI_TOKENS.LOGGER_SERVICE,
    LOGGER_DI_TOKENS.LOGGER_CONFIG_SERVICE,
  ],
})
export class LoggerModule {}
