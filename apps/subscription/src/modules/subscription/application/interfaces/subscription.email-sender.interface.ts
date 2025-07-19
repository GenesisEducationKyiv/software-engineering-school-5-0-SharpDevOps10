export interface ISubscriptionEmailSender {
  sendConfirmationEmail(email: string, token: string): Promise<void>;
}
