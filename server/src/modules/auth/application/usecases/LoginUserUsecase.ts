import { UserStatus } from "../../domain/enum/UserStatus";
import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../domain/services/IPasswordService";
import { ITokenService } from "../../domain/services/ITokenService";
import { LoginDto } from "../dto/LoginDto";
import { LoginResponseDto } from "../dto/LoginResponseDto";

export class LoginUserUsecase{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly jwtService: ITokenService,
        private readonly redisRefreshTokenService:IRefreshTokenRepository
    ) { }
    
    async execute(dto: LoginDto): Promise<LoginResponseDto>{
        const user = await this.userRepository.findByEmail(dto.email)
        if (!user) throw new Error("User not exist, register user")
        if (user.status === UserStatus.BLOCKED) throw new Error("User is blocked")
        const matchPassword = this.passwordService.compare(dto.password, user.password)
        if (!matchPassword) throw new Error("Invalid password")
        const sessionId = crypto.randomUUID()
        const payload = {
            id: user.id!,
            role: user.role,
            sessionId
        }
        const accessToken = this.jwtService.generateAccessToken(payload)
        const refreshToken = this.jwtService.generateRefreshToken(payload)

        await this.redisRefreshTokenService.save(user.id!, sessionId, refreshToken)

        return {
            accessToken,
            refreshToken,
            user: {
                _id: user.id!,
                name: user.name,
                email: user.email,
                role:user.role
            }
        }
    }
}