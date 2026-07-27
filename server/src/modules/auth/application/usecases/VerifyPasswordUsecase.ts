import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserStatus } from "../../domain/enum/UserStatus";
import { IPasswordResetTokenRepository } from "../../domain/repositories/IPasswordResetTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ICryptoService } from "../../domain/services/ICryptoService";
import { IEmailService } from "../../domain/services/IEmailService";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { IVerifyPasswordUsecase } from "../interfaces/IVerifyPasswordUsecase";


export class VerifyPasswordUsecase implements IVerifyPasswordUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService,
        private readonly cryptoService: ICryptoService,
        private readonly passwordResetTokenService: IPasswordResetTokenRepository,
        private readonly passwordService:IPasswordService
    ) { }
    
    async execute(email: string, password:string): Promise<void> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new NotFoundError("User not found")
        if (user.status === UserStatus.BLOCKED) throw new UnauthorizedError("User is blocked")
        const matchPass = await this.passwordService.compare(password, user.password!)
        if(!matchPass) throw new BadRequestError("Invalid password")
        
        const token = this.cryptoService.generate()
        const hashedToken = this.cryptoService.hash(token)
        const link = process.env.RESET_LINK + token
        await this.passwordResetTokenService.save(hashedToken, user.id!)
        await this.emailService.sendResetLink(email, link)
    }
}