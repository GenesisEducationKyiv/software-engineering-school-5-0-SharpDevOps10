import { TokenService } from '@subscription/infrastructure/token/token.service';
import { configServiceMock } from '../../mocks/configs/config.service.mock';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new TokenService(configServiceMock);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should return a valid UUID', () => {
      const token = service.generateToken();

      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(token).toMatch(uuidV4Regex);
    });

    it('should generate unique tokens', () => {
      const token1 = service.generateToken();
      const token2 = service.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('isTokenExpired', () => {
    const ttlHours = 1;
    const ttlMs = ttlHours * 60 * 60 * 1000;

    it('should return false if token was just created', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      jest.setSystemTime(now);

      const expired = service.isTokenExpired(now);
      expect(expired).toBe(false);
    });

    it('should return true if token is older than TTL', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      const oldDate = new Date(now.getTime() - ttlMs - 6 * 60 * 1000);

      jest.setSystemTime(now);

      const expired = service.isTokenExpired(oldDate);

      expect(expired).toBe(true);
    });

    it('should return false if token is exactly on TTL edge', () => {
      const now = new Date('2025-01-01T00:00:00Z');
      const edgeDate = new Date(now.getTime() - ttlMs);

      jest.setSystemTime(now);

      const expired = service.isTokenExpired(edgeDate);
      expect(expired).toBe(false);
    });
  });
});
