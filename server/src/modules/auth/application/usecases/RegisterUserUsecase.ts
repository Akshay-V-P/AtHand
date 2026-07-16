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
    
    async execute(dto: RegisterDto): Promise<void>{
        const user = await this.userRepository.findByEmail(dto.email)
        if (user) throw new Error("User already exist")
        const hashedPassword = await this.passwordService.hash(dto.password)
        const newUser = new User(
            dto.name,
            dto.email,
            dto.phone,
            hashedPassword,
            UserRole.USER,
            false
        )
        await this.userRepository.create(newUser)
        const otp = await this.otpService.generate(dto.email)
        await this.emailService.sendOTP(dto.email, otp)
    }
}