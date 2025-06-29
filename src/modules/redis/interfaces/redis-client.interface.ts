export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: 'EX', ttl: number): Promise<'OK' | null>;
  del(key: string): Promise<number>;
  quit(): Promise<void>;
  on(event: 'connect', callback: () => void): this;
  on(event: 'error', callback: (error: unknown) => void): this;
}
