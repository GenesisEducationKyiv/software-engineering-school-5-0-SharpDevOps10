import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_DI_TOKENS } from '@modules/config/di-tokens';

@Module({
  providers: [
    ConfigService,
    {
      provide: CONFIG_DI_TOKENS.CONFIG_SERVICE,
      useExisting: ConfigService,
    },
  ],
  exports: [ConfigService, CONFIG_DI_TOKENS.CONFIG_SERVICE],
})
export class ConfigModule {}
