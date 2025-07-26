import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { LogResponseToFile } from './log-response-to-file.decorator';

jest.mock('node:fs', () => ({
  promises: {
    mkdir: jest.fn(),
    appendFile: jest.fn(),
  },
}));

describe('LogResponseToFile', () => {
  const fsMock = fs as jest.Mocked<typeof fs>;
  const providerName = 'test-provider';

  const createTestClass = (): { successfulMethod: () => Promise<string>, failingMethod: () => Promise<void> } => {
    class TestService {
      @LogResponseToFile(providerName)
      async successfulMethod (): Promise<string> {
        return await Promise.resolve('test-response');
      }

      @LogResponseToFile(providerName)
      async failingMethod (): Promise<void> {
        await Promise.resolve();
        throw new Error('Something went wrong');
      }
    }

    return new TestService();
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the response of a successful method', async () => {
    const service = createTestClass();

    const result = await service.successfulMethod();

    expect(result).toBe('test-response');
    expect(fsMock.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(fsMock.appendFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('logs', 'provider.log')),
      expect.stringContaining('Response: "test-response"'),
    );
  });

  it('should log the error of a failed method and rethrow it', async () => {
    const service = createTestClass();

    await expect(service.failingMethod()).rejects.toThrow('Something went wrong');

    expect(fsMock.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(fsMock.appendFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('logs', 'provider.log')),
      expect.stringContaining('Error: Error: Something went wrong'),
    );
  });
});
