import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UserRole } from "../../domain/enum/UserRole";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAuthService } from "../../domain/services/IAuthService";
import { ITokenService } from "../../domain/services/ITokenService";
import { LoginResponseDto } from "../dto/LoginResponseDto";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class SignInWithGoogleUsecase implements IUsecase<string, LoginResponseDto>{
    constructor(
        private readonly authService: IAuthService,
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly refreshTokenService:IRefreshTokenRepository,
    ) { }
    
    async execute(token:string): Promise<LoginResponseDto> {
        const googleUser = await this.authService.verifyToken(token)
        if (!googleUser) throw new BadRequestError("User not authenticated")
        let user = await this.userRepository.findByEmail(googleUser.email)
        if (!user) {
            user = await this.userRepository.create({
                id:undefined,
                name: googleUser.name,
                email: googleUser.email,
                role: UserRole.USER,
                status:"ACTIVE",
                isVerified: true,
                googleId: googleUser.googleId,
                profilePhotoUrl: googleUser.picture,
            })
        }

        if (!user.id) throw new NotFoundError("User creation failed")
        const sessionId = crypto.randomUUID()
        const payload = {
            id: user.id,
            role: user.role,
            sessionId
        }

        const accessToken = this.tokenService.generateAccessToken(payload)
        const refreshToken = this.tokenService.generateRefreshToken(payload)

        await this.refreshTokenService.save(user.id, sessionId, refreshToken)

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name:user.name,
                email: user.email,
                role: user.role,
                googleId: user.googleId!,
                profilePhotoUrl:user.profilePhotoUrl!
            }
        }


    }
}