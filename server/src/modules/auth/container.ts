import { LoginUserUsecase } from "./application/usecases/LoginUserUsecase";
import { LogoutUserUseCase } from "./application/usecases/LogoutUserUseCase";
import { RegisterUserUsecase } from "./application/usecases/RegisterUserUsecase";
import { ResendOtpUsecase } from "./application/usecases/ResendOtpUsecase";
import { VerifyOtpUsecase } from "./application/usecases/VerifyOtpUsecase";
import { RedisRefreshTokenRepository } from "./infrastructure/database/repositories/RedisRefreshTokenRepository";
import { UserRepository } from "./infrastructure/database/repositories/UserRepository";
import { EmailService } from "./infrastructure/services/EmailService";
import { JwtService } from "./infrastructure/services/JwtService";
import { OtpService } from "./infrastructure/services/OtpService";
import { PasswordService } from "./infrastructure/services/PasswordService";
import { AuthController } from "./presentation/controllers/AuthController";
import { AuthMiddleware } from "./presentation/middlewares/AuthMiddleware";
import { createAuthRoutes } from "./presentation/routes/auth.routes";

const userRepository = new UserRepository()
const redisRefreshTokenRepo = new RedisRefreshTokenRepository()

const passwordService = new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()
const jwtService = new JwtService()

const registerUserUsecase = new RegisterUserUsecase(userRepository, passwordService, otpService, emailService)
const verifyOtpUsecase = new VerifyOtpUsecase(userRepository, otpService)
const resendOtpUsecase = new ResendOtpUsecase(userRepository, otpService, emailService)
const loginUserUsecase = new LoginUserUsecase(userRepository, passwordService, jwtService, redisRefreshTokenRepo)
const logoutUserUsecase = new LogoutUserUseCase(redisRefreshTokenRepo)

const authController = new AuthController(registerUserUsecase, verifyOtpUsecase, resendOtpUsecase, loginUserUsecase, logoutUserUsecase)

export const authMiddleware = new AuthMiddleware(jwtService)

export const authRoute = createAuthRoutes(authController, authMiddleware)