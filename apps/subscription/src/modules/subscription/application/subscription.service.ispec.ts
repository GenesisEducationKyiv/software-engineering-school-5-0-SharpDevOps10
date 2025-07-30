import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ISubscriptionConfigService } from '../../config/interfaces/subscription-config.service.interface';
import { SubscriptionService } from './subscription.service';
import { SubscriptionEmailSenderInterface } from './interfaces/subscription.email-sender.interface';
import { PrismaService } from '../../../database/prisma.service';
import { TokenService } from '../infrastructure/token/token.service';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription.repository';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';
import { SubscriptionFrequencyEnum } from '@grpc-types/subscription-frequency.enum';
import { AlreadyExistsException, InvalidArgumentException } from '@exceptions/grpc-exceptions';
import { LoggerServiceInterface } from '@utils/modules/logger/logger.service.interface';
import { LOGGER_DI_TOKENS } from '@utils/modules/logger/di-tokens';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaClient;

  const emailServiceMock: jest.Mocked<SubscriptionEmailSenderInterface> = {
    sendConfirmationEmail: jest.fn(),
  };

  const weatherClientMock = {
    isCityValid: jest.fn().mockResolvedValue({ isValid: true }),
  };

  const loggerMock: jest.Mocked<LoggerServiceInterface> = {
    setContext: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const configServiceMock: jest.Mocked<ISubscriptionConfigService> = {
    getTokenTtlHours: jest.fn().mockReturnValue(1),

  } as unknown as jest.Mocked<ISubscriptionConfigService>;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        PrismaService,
        TokenService,
        {
          provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_REPOSITORY,
          useClass: SubscriptionRepository,
        },
        {
          provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_EMAIL_SENDER,
          useValue: emailServiceMock,
        },
        {
          provide: SUBSCRIPTION_DI_TOKENS.SUBSCRIPTION_TOKEN_SERVICE,
          useExisting: TokenService,
        },
        {
          provide: SUBSCRIPTION_CONFIG_DI_TOKENS.SUBSCRIPTION_CONFIG_SERVICE,
          useValue: configServiceMock,
        },
        {
          provide: SUBSCRIPTION_DI_TOKENS.WEATHER_CLIENT,
          useValue: weatherClientMock,
        },
        {
          provide: LOGGER_DI_TOKENS.LOGGER_SERVICE,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get(SubscriptionService);
  });

  it('should create subscription and send email', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const dbEntry = await prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });

    expect(dbEntry).toBeDefined();
    expect(dbEntry?.token).toBeDefined();
    expect(emailServiceMock.sendConfirmationEmail).toHaveBeenCalledWith(dto.email, dbEntry?.token);
  });

  it('should throw ConflictException if subscription already exists', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'dup@example.com',
      city: 'Lviv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    await expect(service.subscribe(dto)).rejects.toThrow(AlreadyExistsException);
  });

  it('should confirm a subscription', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'confirm@example.com',
      city: 'Odesa',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const sub = await prisma.subscription.findFirstOrThrow({
      where: { email: dto.email },
    });

    await service.confirm(sub.token);

    const updated = await prisma.subscription.findUnique({ where: { id: sub.id } });

    expect(updated?.confirmed).toBe(true);
  });

  it('should throw ConflictException if already confirmed', async () => {
    const dto = {
      email: 'confirmed@example.com',
      city: 'Dnipro',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });
    await service.confirm(sub.token);

    await expect(service.confirm(sub.token)).rejects.toThrow(AlreadyExistsException);
  });

  it('should unsubscribe confirmed user', async () => {
    const dto = {
      email: 'unsub@example.com',
      city: 'Kharkiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await service.confirm(sub.token);

    await service.unsubscribe(sub.token);

    const found = await prisma.subscription.findUnique({ where: { id: sub.id } });
    expect(found).toBeNull();
  });

  it('should not allow unsubscribe if not confirmed', async () => {
    const dto = {
      email: 'not-confirmed@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await expect(service.unsubscribe(sub.token)).rejects.toThrow(AlreadyExistsException);
  });

  it('should throw BadRequestException if token is expired', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'expired@example.com',
      city: 'Vienna',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100),
      },
    });

    const expiredSub = await prisma.subscription.findFirstOrThrow({ where: { id: sub.id } });

    await expect(service.confirm(expiredSub.token)).rejects.toThrow(InvalidArgumentException);
  });

  it('should return only confirmed subscriptions for given frequency', async () => {
    const dto1: CreateSubscriptionDto = {
      email: 'hourly1@example.com',
      city: 'Berlin',
      frequency: SubscriptionFrequencyEnum.HOURLY,
    };

    const dto2: CreateSubscriptionDto = {
      email: 'daily1@example.com',
      city: 'Berlin',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto1);
    await service.subscribe(dto2);

    const sub1 = await prisma.subscription.findFirstOrThrow({ where: { email: dto1.email } });
    await service.confirm(sub1.token);

    const result = await service.getConfirmedSubscriptions(SubscriptionFrequencyEnum.HOURLY);

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(dto1.email);
    expect(result[0].frequency).toBe(SubscriptionFrequencyEnum.HOURLY);
    expect(result[0].confirmed).toBe(true);
  });

  it('should return empty array if no confirmed subscriptions for given frequency', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'not-confirmed2@example.com',
      city: 'Madrid',
      frequency: SubscriptionFrequencyEnum.HOURLY,
    };

    await service.subscribe(dto);

    const result = await service.getConfirmedSubscriptions(SubscriptionFrequencyEnum.HOURLY);

    expect(result).toEqual([]);
  });
});
