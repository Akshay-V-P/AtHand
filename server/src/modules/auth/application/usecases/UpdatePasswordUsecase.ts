import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserStatus } from "../../domain/enum/UserStatus";
import { IPasswordResetTokenRepository } from "../../domain/repositories/IPasswordResetTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ICryptoService } from "../../domain/services/ICryptoService";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { IUpdatePasswordUsecase } from "../interfaces/IUpdatePasswordUsecase";

export class UpdatePasswordUsecase implements IUpdatePasswordUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly resetTokenService: IPasswordResetTokenRepository,
        private readonly cryptoService:ICryptoService
    ){}
    async execute(token: string, newPassword: string): Promise<void> {
        const hashToken = this.cryptoService.hash(token)
        const tokenValue = await this.resetTokenService.find(hashToken)
        if (!tokenValue) throw new BadRequestError("Link expired")
        
        const user = await this.userRepository.findById(tokenValue)
        if (!user) throw new NotFoundError("User not found")
        if (user.status === UserStatus.BLOCKED) throw new UnauthorizedError("User is blocked")
        
        const hashedPassword = await this.passwordService.hash(newPassword)
        await this.userRepository.update(user.id!, {password:hashedPassword})
    }
}