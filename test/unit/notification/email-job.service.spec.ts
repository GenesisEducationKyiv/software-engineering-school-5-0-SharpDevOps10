import { Test, TestingModule } from '@nestjs/testing';
import { EmailJobService } from '@notification/application/jobs/email-job.service';
import { SubscriptionFrequencyEnum } from '@subscription/domain/enums/subscription-frequency.enum';
import { randomUUID } from 'node:crypto';
import type { ISubscriptionNotifier } from '@notification/application/interfaces/subscription.notifier.interface';
import type { IWeatherService } from '@weather/application/services/interfaces/weather.service.interface';
import type { IEmailService } from '@shared/interfaces/email-service.interface';
import type { ILoggerService } from '@shared/interfaces/logger.service.interface';
import { SUBSCRIPTION_DI_TOKENS } from '@subscription/di-tokens';
import { WEATHER_DI_TOKENS } from '@weather/di-tokens';
import { EMAIL_DI_TOKENS } from '@email/di-tokens';
import { LOGGER_DI_TOKENS } from '@logger/di-tokens';

describe('EmailJobService', () => {
  let service: EmailJobService;

  const mockSubs = [
    {
      id: randomUUID(),
      email: 'new@example.com',
      city: 'Odesa',
      frequency: SubscriptionFrequencyEnum.HOURLY,
      confirmed: true,
      token: randomUUID(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: randomUUID(),
      email: 'john@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
      confirmed: true,
      token: randomUUID(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  const subscriptionNotifierMock: jest.Mocked<ISubscriptionNotifier> = {
    getConfirmedSubscriptions: jest.fn().mockResolvedValue(mockSubs),
  };

  const weatherServiceMock: jest.Mocked<IWeatherService> = {
    getWeather: jest.fn(),
  };

  const emailServiceMock: jest.Mocked<IEmailService> = {
    sendWeatherUpdateEmail: jest.fn(),
    sendConfirmationEmail: jest.fn(),
  };

  const loggerMock: jest.Mocked<ILoggerService> = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailJobService,
        { provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_NOTIFIER, useValue: subscriptionNotifierMock },
        { provide: WEATHER_DI_TOKENS.WEATHER_SERVICE, useValue: weatherServiceMock },
        { provide: EMAIL_DI_TOKENS.EMAIL_SERVICE, useValue: emailServiceMock },
        { provide: LOGGER_DI_TOKENS.LOGGER_SERVICE, useValue: loggerMock },
      ],
    }).compile();

    service = module.get(EmailJobService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should filter subscriptions by frequency and send emails', async () => {
    const city = 'Paris';
    subscriptionNotifierMock.getConfirmedSubscriptions.mockResolvedValue(mockSubs);
    weatherServiceMock.getWeather.mockResolvedValue({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    });

    await service.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);

    expect(weatherServiceMock.getWeather).toHaveBeenCalledWith(city);
    expect(emailServiceMock.sendWeatherUpdateEmail).toHaveBeenCalledWith(
      'john@example.com',
      city,
      {
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      },
      'daily',
    );

    expect(loggerMock.log).toHaveBeenCalledWith('Sent weather to john@example.com [Paris]');
  });

  it('should log error if email sending fails', async () => {
    subscriptionNotifierMock.getConfirmedSubscriptions.mockResolvedValue([
      {
        id: randomUUID(),
        email: 'fail@example.com',
        city: 'Odesa',
        frequency: SubscriptionFrequencyEnum.HOURLY,
        confirmed: true,
        token: 'mock-token',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]);
    weatherServiceMock.getWeather.mockResolvedValue({
      temperature: 10,
      humidity: 70,
      description: 'Rainy',
    });
    emailServiceMock.sendWeatherUpdateEmail.mockRejectedValueOnce(new Error('SMTP Error'));

    await service.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);

    expect(loggerMock.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to send to fail@example.com: SMTP Error'),
    );
  });
});
