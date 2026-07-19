import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService } from "../../domain/services/ITokenService";

export class LogoutUserUseCase{
    constructor(
        private readonly redisRefreshTokenRepository:IRefreshTokenRepository
    ) { }
    
    async execute(id: string, sessionId: string): Promise<void>{
        const token = await this.redisRefreshTokenRepository.find(id, sessionId)
        if(!token) throw new Error("User already logged out")
        await this.redisRefreshTokenRepository.delete(id, sessionId)
    }
}