export interface IEmailService{
    sendOTP(email: string, otp: string): Promise<void>;
    sendResetLink(email: string, link: string): Promise<void>
}