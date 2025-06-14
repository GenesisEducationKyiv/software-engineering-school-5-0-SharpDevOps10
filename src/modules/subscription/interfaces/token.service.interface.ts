export interface ITokenService {
  generateToken(): string;
  isTokenExpired(createdAt: Date): boolean;
}
