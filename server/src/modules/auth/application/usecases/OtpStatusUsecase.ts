import { IOtpService } from "../../domain/services/IOtpService";
import { IOtpStatusUsecase } from "../interfaces/IOtpStatusUsecase";

export class OtpStatusUsecase implements IOtpStatusUsecase{
    constructor(
        private readonly otpSevice:IOtpService
    ) { }
    
    async execute(email:string): Promise<object>{
        const ttl = await this.otpSevice.getRemainingTime(email)
        return {
            remainingTime: ttl,
            canResend:ttl === 0
        }
    }
}