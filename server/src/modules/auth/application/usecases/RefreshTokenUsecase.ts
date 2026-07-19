import { UserStatus } from "../../domain/enum/UserStatus";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService, JwtPayload } from "../../domain/services/ITokenService";

export class RefreshTokenUsecase{
    constructor(
        private readonly jwtService: ITokenService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly userRepository:IUserRepository
    ) { }
    
    async execute(refreshToken:string): Promise<string>{
        const matchToken = this.jwtService.verifyRefreshToken(refreshToken)
        if (!matchToken) throw new Error("Invalid token")
        const tokenExist = await this.refreshTokenRepository.find(matchToken.id, matchToken.sessionId)
        if (!tokenExist) throw new Error("Session expired. login needed")
        const user = await this.userRepository.findById(matchToken.id)
        if (!user) throw new Error("User not found")
        if (user.status === UserStatus.BLOCKED) throw new Error("User is blocked by admin");
        const payload:JwtPayload = {
            id: matchToken.id,
            sessionId: matchToken.sessionId,
            role:user.role
        }
        const accessToken = this.jwtService.generateAccessToken(payload)
        return accessToken
    }
}