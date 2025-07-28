import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { EmailJobService } from './email-job.service';
import { SubscriptionFrequencyEnum } from '@shared-types/grpc/common/subscription-frequency.enum';
import { ISubscriptionNotifier } from '../interfaces/subscription.notifier.interface';
import { IWeatherClient } from '../interfaces/weather.client.interface';
import { INotificationEmailSender } from '../interfaces/notification.email-sender.interface';
import { ILoggerService } from '@utils/modules/logger/logger.service.interface';
import { NOTIFICATION_DI_TOKENS } from '../../di-tokens';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

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
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      email: 'john@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
      confirmed: true,
      token: randomUUID(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const subscriptionNotifierMock: jest.Mocked<ISubscriptionNotifier> = {
    getConfirmedSubscriptions: jest.fn().mockResolvedValue(mockSubs),
  };

  const weatherServiceMock: jest.Mocked<IWeatherClient> = {
    getWeather: jest.fn(),
  };

  const emailServiceMock: jest.Mocked<INotificationEmailSender> = {
    sendWeatherUpdateEmail: jest.fn(),
  };

  const loggerMock: jest.Mocked<ILoggerService> = {
    log: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailJobService,
        { provide: NOTIFICATION_DI_TOKENS.SUBSCRIPTION_CLIENT, useValue: subscriptionNotifierMock },
        { provide: NOTIFICATION_DI_TOKENS.WEATHER_CLIENT, useValue: weatherServiceMock },
        { provide: NOTIFICATION_DI_TOKENS.NOTIFICATION_EMAIL_SENDER, useValue: emailServiceMock },
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
    subscriptionNotifierMock.getConfirmedSubscriptions.mockResolvedValue({
      subscriptions: mockSubs,
    });
    weatherServiceMock.getWeather.mockResolvedValue({
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    });

    await service.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);

    expect(weatherServiceMock.getWeather).toHaveBeenCalledWith(city);
    expect(emailServiceMock.sendWeatherUpdateEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
      city: 'Paris',
      weather: {
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      },
      frequency: 'daily',
    });

    expect(loggerMock.log).toHaveBeenCalledWith('Sent weather to john@example.com [Paris]');
  });

  it('should log error if email sending fails', async () => {
    subscriptionNotifierMock.getConfirmedSubscriptions.mockResolvedValue({
      subscriptions: [
        {
          id: randomUUID(),
          email: 'fail@example.com',
          city: 'Odesa',
          frequency: SubscriptionFrequencyEnum.HOURLY,
          confirmed: true,
          token: 'mock-token',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
    weatherServiceMock.getWeather.mockResolvedValue({
      temperature: 10,
      humidity: 70,
      description: 'Rainy',
    });
    (emailServiceMock.sendWeatherUpdateEmail as jest.Mock).mockImplementationOnce(() => {
      throw new Error('SMTP Error');
    });

    await service.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.HOURLY);

    expect(loggerMock.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to send to fail@example.com: SMTP Error'),
    );
  });

  it('should do nothing if there are no subscriptions for given frequency', async () => {
    subscriptionNotifierMock.getConfirmedSubscriptions.mockResolvedValue({ subscriptions: [] });

    await service.sendWeatherEmailsByFrequency(SubscriptionFrequencyEnum.DAILY);

    expect(weatherServiceMock.getWeather).not.toHaveBeenCalled();
    expect(emailServiceMock.sendWeatherUpdateEmail).not.toHaveBeenCalled();
    expect(loggerMock.log).not.toHaveBeenCalled();
  });
});
