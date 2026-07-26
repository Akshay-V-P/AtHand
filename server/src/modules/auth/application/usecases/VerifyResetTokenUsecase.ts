import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { IPasswordResetTokenRepository } from "../../domain/repositories/IPasswordResetTokenRepository";
import { ICryptoService } from "../../domain/services/ICryptoService";
import { IVerifyResetTokenUsecase } from "../interfaces/IVerifyResetTokenUsecase";

export class VerifyResetTokenUsecase implements IVerifyResetTokenUsecase{
    constructor(
        private readonly cryptoService: ICryptoService,
        private readonly passwordResetTokenRepo: IPasswordResetTokenRepository
    ) { }
    
    async execute(token: string): Promise<void> {
        const hashedToken = this.cryptoService.hash(token)
        const tokenValue = await this.passwordResetTokenRepo.find(hashedToken)
        if (!tokenValue) throw new NotFoundError("link not found")
    }
}