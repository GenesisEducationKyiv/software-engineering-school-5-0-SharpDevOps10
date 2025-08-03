import { Module } from '@nestjs/common';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';
import { LoggerService } from '@utils/modules/logger/logger.service';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService): Params => ({
        pinoHttp: {
          autoLogging: true,
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
    {
      provide: LOGGER_DI_TOKENS.LOGGER_SERVICE,
      useClass: LoggerService,
    },
  ],
  exports: [LOGGER_DI_TOKENS.LOGGER_SERVICE],
})
export class LoggerModule {}
