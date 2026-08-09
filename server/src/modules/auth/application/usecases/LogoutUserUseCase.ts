import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { LogoutDto } from "../dto/LogoutDto";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class LogoutUserUseCase implements IUsecase<LogoutDto, void>{
    constructor(
        private readonly redisRefreshTokenRepository:IRefreshTokenRepository
    ) { }
    
    async execute(data:LogoutDto): Promise<void>{
        const token = await this.redisRefreshTokenRepository.find(data.id, data.sessionId)
        if(!token) throw new BadRequestError("User already logged out")
        await this.redisRefreshTokenRepository.delete(data.id, data.sessionId)
    }
}