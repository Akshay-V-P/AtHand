import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { OtpVerificationEnum } from "../../domain/enum/OtpVerificationEnum";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpService } from "../../domain/services/IOtpService";
import { OtpVerifyDto } from "../dto/OtpVerifyDto";
import { IUsecase } from "../interfaces/IUsecase";

export class VerifyOtpUsecase implements IUsecase<OtpVerifyDto, void>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpService: IOtpService
    ) { }
    
    async execute(dto: OtpVerifyDto): Promise<void>{
        const user = await this.userRepository.findByEmail(dto.email)
        if (!user) throw new NotFoundError("User not found")
        
        const result = await this.otpService.verify(dto.email, dto.otp)
        if (result === OtpVerificationEnum.EXPIRED) throw new NotFoundError("OTP expired")
        if (result === OtpVerificationEnum.INVALID) throw new BadRequestError("Incorrect OTP")
        
        await this.userRepository.update(user.id!, { isVerified: true })
        await this.otpService.delete(dto.email)
    }
}