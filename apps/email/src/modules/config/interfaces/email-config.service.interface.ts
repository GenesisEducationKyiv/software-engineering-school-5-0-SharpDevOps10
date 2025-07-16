export interface IEmailConfigService {
  getSmtpHost(): string;
  getSmtpPort(): number;
  getSmtpUser(): string;
  getSmtpPass(): string;
  getMailFrom(): string;

}
