export interface SubscriptionEmailSenderInterface {
  sendConfirmationEmail(email: string, token: string): void;
}
