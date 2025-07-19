import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NOTIFICATION_DI_TOKENS } from '../di-tokens';
import { IEmailJobService } from '../application/interfaces/email.job.service.interface';
import { CRON_CONSTANTS } from './constants/cron.constants';
import { SubscriptionFrequencyEnum } from '@shared-types/common/subscription-frequency.enum';

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

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: CRON_CONSTANTS.NAMES.HOURLY,
    timeZone: CRON_CONSTANTS.TIMEZONE,
  })
  async sendMinutelyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);
  }
}
