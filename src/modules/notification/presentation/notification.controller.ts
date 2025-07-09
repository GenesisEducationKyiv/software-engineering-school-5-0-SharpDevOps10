import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import type { IEmailJobService } from '@notification/application/interfaces/email.job.service.interface';
import { NOTIFICATION_DI_TOKENS } from '@notification/di-tokens';
import { CRON_CONSTANTS } from '@notification/presentation/constants/cron.constants';

@Injectable()
export class NotificationController {
  constructor (
    @Inject(NOTIFICATION_DI_TOKENS.EMAIL_JOB_SERVICE)
    private readonly emailJobService: IEmailJobService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: CRON_CONSTANTS.NAMES.HOURLY,
    timeZone: CRON_CONSTANTS.TIMEZONE,
  })
  async sendHourlyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    name: CRON_CONSTANTS.NAMES.DAILY,
    timeZone: CRON_CONSTANTS.TIMEZONE,
  })
  async sendDailyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);
  }
}
