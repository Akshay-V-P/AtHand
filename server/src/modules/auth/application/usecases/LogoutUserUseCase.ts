import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { ILogoutUserUsecase } from "../interfaces/ILogoutUserUsecase";

export class LogoutUserUseCase implements ILogoutUserUsecase{
    constructor(
        private readonly redisRefreshTokenRepository:IRefreshTokenRepository
    ) { }
    
    async execute(id: string, sessionId: string): Promise<void>{
        const token = await this.redisRefreshTokenRepository.find(id, sessionId)
        if(!token) throw new BadRequestError("User already logged out")
        await this.redisRefreshTokenRepository.delete(id, sessionId)
    }
}