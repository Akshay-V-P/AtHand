export interface IOtpService{
    generate(email: string): Promise<string>;
    verify(email: string, enteredOtp: string): Promise<boolean>;
    delete(email:string): Promise<void>
}