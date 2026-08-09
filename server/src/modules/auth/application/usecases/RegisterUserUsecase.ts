
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { User } from "../../domain/entities/User";
import { UserRole } from "../../domain/enum/UserRole";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEmailService } from "../../domain/services/IEmailService";
import { IOtpService } from "../../domain/services/IOtpService";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { ITokenService, RegTokenPayload } from "../../domain/services/ITokenService";
import { RegisterDto } from "../dto/RegisterDto";
import { RegisterResponseDto } from "../dto/RegisterResponseDto";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class RegisterUserUsecase implements IUsecase<RegisterDto, RegisterResponseDto>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly otpService: IOtpService,
        private readonly emailService: IEmailService,
        private readonly tokenService :ITokenService
    ) { }
    
    async execute(dto: RegisterDto): Promise<RegisterResponseDto>{
        const user = await this.userRepository.findByEmail(dto.email)
        if(user && user?.isVerified) throw new BadRequestError("User already exist")
        let newRegister = false
        let newUser
        if (!user) {
            const hashedPassword = await this.passwordService.hash(dto.password)
            newUser = new User(
                undefined,
                dto.name,
                dto.email,
                UserRole.USER,
                "ACTIVE",
                false,
                dto.phone,
                hashedPassword,
            )
            await this.userRepository.create(newUser)
            newRegister = true
        }
        
        const otp = await this.otpService.generate(dto.email)
        await this.emailService.sendOTP(dto.email, otp)
        const payload: RegTokenPayload = {
            email:dto.email
        }
        const registrationToken = this.tokenService.generateRegistrationToken(payload)
        return {newRegister, registrationToken}
    }
}