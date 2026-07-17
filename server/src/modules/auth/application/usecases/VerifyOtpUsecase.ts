import { OtpVerificationEnum } from "../../domain/enum/OtpVerificationEnum";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpService } from "../../domain/services/IOtpService";
import { OtpVerifyDto } from "../dto/OtpVerifyDto";

export class VerifyOtpUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpService: IOtpService
    ) { }
    
    async execute(dto: OtpVerifyDto): Promise<void>{
        const user = await this.userRepository.findByEmail(dto.email)
        if (!user) throw new Error("User not found")
        
        const result = await this.otpService.verify(dto.email, dto.otp)
        if (result === OtpVerificationEnum.EXPIRED) throw new Error("Otp expired")
        if (result === OtpVerificationEnum.INVALID) throw new Error("Incorrect otp")
        
        await this.userRepository.update(dto.id, { isVerified: true })
        await this.otpService.delete(dto.email)
    }
}