import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEmailService } from "../../domain/services/IEmailService";
import { IOtpService } from "../../domain/services/IOtpService";
import { ResendOtpDto } from "../dto/ResendOtpDto";

export class ResendOtpUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService
    ) { }
    
    async execute(dto: ResendOtpDto): Promise<void>{
        const user = await this.userRepository.findByEmail(dto.email)
        if (!user) throw new NotFoundError("User not found")
        if (user.isVerified) throw new BadRequestError("User already verified")
        const otp = await this.otpService.find(dto.email)
        if(otp) throw new ConflictError("OTP exists")
        const newOtp = await this.otpService.generate(dto.email)
        await this.emailService.sendOTP(dto.email, newOtp)
    }
}