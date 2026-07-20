import { OtpVerificationEnum } from "../enum/OtpVerificationEnum";

export interface IOtpService{
    generate(email: string): Promise<string>;
    find(email: string): Promise<boolean>;
    verify(email: string, enteredOtp: string): Promise<OtpVerificationEnum>;
    delete(email: string): Promise<void>;
    getRemainingTime(email: string): Promise<number>;
}