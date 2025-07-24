import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ISubscriptionConfigService } from '../../config/interfaces/subscription-config.service.interface';
import { SubscriptionService } from './subscription.service';
import { ISubscriptionEmailSender } from './interfaces/subscription.email-sender.interface';
import { PrismaService } from '../../../database/prisma.service';
import { TokenService } from '../infrastructure/token/token.service';
import { SUBSCRIPTION_DI_TOKENS } from '../constants/di-tokens';
import { SubscriptionRepository } from '../infrastructure/repositories/subscription.repository';
import { SUBSCRIPTION_CONFIG_DI_TOKENS } from '../../config/di-tokens';
import { CreateSubscriptionDto } from '../presentation/dto/create-subscription.dto';
import { SubscriptionFrequencyEnum } from '@shared-types/common/subscription-frequency.enum';
import { AlreadyExistsException, InvalidArgumentException } from '@exceptions/grpc-exceptions';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaClient;

  const emailServiceMock: jest.Mocked<ISubscriptionEmailSender> = {
    sendConfirmationEmail: jest.fn(),
  };

  const weatherClientMock = {
    isCityValid: jest.fn().mockResolvedValue({ isValid: true }),
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
});
