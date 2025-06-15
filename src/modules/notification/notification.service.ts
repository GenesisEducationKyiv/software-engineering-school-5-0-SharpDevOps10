import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import { DI_TOKENS } from '@utils/di-tokens/DI-tokens';
import type { IEmailJobService } from '@notification/interfaces/email.job.service.interface';

@Injectable()
export class NotificationService {
  constructor (
    @Inject(DI_TOKENS.EMAIL_JOB_SERVICE)
    private readonly emailJobService: IEmailJobService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'sendHourlyEmails',
    timeZone: 'Europe/Kyiv',
  })
  async sendHourlyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    name: 'sendDailyEmails',
    timeZone: 'Europe/Kyiv',
  })
  async sendDailyEmails (): Promise<void> {
    await this.emailJobService.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);
  }
}
