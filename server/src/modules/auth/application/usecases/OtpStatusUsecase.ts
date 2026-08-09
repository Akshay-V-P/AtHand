import { IOtpService } from "../../domain/services/IOtpService";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class OtpStatusUsecase implements IUsecase<string, object>{
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