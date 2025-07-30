export interface TokenServiceInterface {
  generateToken(): string;
  isTokenExpired(createdAt: Date): boolean;
}
