export interface IEmailConfigService {
  getPort(): number;
  getSmtpHost(): string;
  getSmtpPort(): number;
  getSmtpUser(): string;
  getSmtpPass(): string;
  getMailFrom(): string;

}
