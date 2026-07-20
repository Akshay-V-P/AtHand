import { IOtpService } from "../../domain/services/IOtpService";

export class OtpStatusUsecase{
    constructor(
        private readonly otpSevice:IOtpService
    ) { }
    
    async execute(email:string): Promise<Object>{
        const ttl = await this.otpSevice.getRemainingTime(email)
        return {
            remainingTime: ttl,
            canResend:ttl === 0
        }
    }
}