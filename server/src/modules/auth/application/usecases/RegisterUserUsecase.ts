import { User } from "../../domain/entities/User";
import { UserRole } from "../../domain/enum/UserRole";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEmailService } from "../../domain/services/IEmailService";
import { IOtpService } from "../../domain/services/IOtpService";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { RegisterDto } from "../dto/RegisterDto";

export class RegisterUserUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly otpService: IOtpService,
        private readonly emailService:IEmailService
    ) { }
    
    async execute(dto: RegisterDto): Promise<boolean>{
        const user = await this.userRepository.findByEmail(dto.email)
        let newRegister = false
        if (!user) {
            const hashedPassword = await this.passwordService.hash(dto.password)
            const newUser = new User(
                undefined,
                dto.name,
                dto.email,
                dto.phone,
                hashedPassword,
                UserRole.USER,
                "ACTIVE",
                false
            )
            await this.userRepository.create(newUser)
            newRegister = true
        }
        
        const otp = await this.otpService.generate(dto.email)
        await this.emailService.sendOTP(dto.email, otp)
        return newRegister
    }
}