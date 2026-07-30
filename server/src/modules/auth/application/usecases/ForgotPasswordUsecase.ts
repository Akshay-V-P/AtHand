import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserStatus } from "../../domain/enum/UserStatus";
import { IPasswordResetTokenRepository } from "../../domain/repositories/IPasswordResetTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ICryptoService } from "../../domain/services/ICryptoService";
import { IEmailService } from "../../domain/services/IEmailService";
import { IUsecase } from "../interfaces/IUsecase";

export class ForgotPasswordUsecase implements IUsecase<string, void>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService,
        private readonly cryptoService: ICryptoService,
        private readonly passwordResetTokenService:IPasswordResetTokenRepository,
    ) { }
    
    async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new NotFoundError("User not found")
        if (user.status === UserStatus.BLOCKED) throw new UnauthorizedError("User is blocked")
        const token = this.cryptoService.generate()
        const hashedToken = this.cryptoService.hash(token)
        const link = process.env.RESET_LINK + token
        await this.passwordResetTokenService.save(hashedToken, user.id!)
        await this.emailService.sendResetLink(email, link)
    }
}