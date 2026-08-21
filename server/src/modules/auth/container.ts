import { ForgotPasswordUsecase } from "./application/usecases/ForgotPasswordUsecase";
import { GetProfileUsecase } from "./application/usecases/GetProfileUsecase";
import { LoginUserUsecase } from "./application/usecases/LoginUserUsecase";
import { LogoutUserUseCase } from "./application/usecases/LogoutUserUseCase";
import { OtpStatusUsecase } from "./application/usecases/OtpStatusUsecase";
import { RefreshTokenUsecase } from "./application/usecases/RefreshTokenUsecase";
import { RegisterUserUsecase } from "./application/usecases/RegisterUserUsecase";
import { ResendOtpUsecase } from "./application/usecases/ResendOtpUsecase";
import { SignInWithGoogleUsecase } from "./application/usecases/SignInWithGoogleUsecase";
import { UpdatePasswordUsecase } from "./application/usecases/UpdatePasswordUsecase";
import { VerifyOtpUsecase } from "./application/usecases/VerifyOtpUsecase";
import { VerifyPasswordUsecase } from "./application/usecases/VerifyPasswordUsecase";
import { VerifyResetTokenUsecase } from "./application/usecases/VerifyResetTokenUsecase";
import { PasswordResetTokenRepository } from "./infrastructure/database/repositories/PasswordResetTokenRepository";
import { RedisRefreshTokenRepository } from "./infrastructure/database/repositories/RedisRefreshTokenRepository";
import { UserRepository } from "./infrastructure/database/repositories/UserRepository";
import { CryptoService } from "./infrastructure/services/CryptoService";
import { EmailService } from "./infrastructure/services/EmailService";
import { GoogleAuthService } from "./infrastructure/services/GoogleAuthService";
import { JwtService } from "./infrastructure/services/JwtService";
import { OtpService } from "./infrastructure/services/OtpService";
import { PasswordService } from "./infrastructure/services/PasswordService";
import { GoogleController } from "./presentation/controllers/googleControllers/GoogleController";
import { LoginController } from "./presentation/controllers/loginControllers/LoginController";
import { LogoutController } from "./presentation/controllers/logoutControllers/LogoutController";
import { Me } from "./presentation/controllers/meControllers/Me";
import { OtpStatusController } from "./presentation/controllers/otpControllers/OtpStatusController";
import { ResentOtpController } from "./presentation/controllers/otpControllers/ResentOtpController";
import { VerifyOtpController } from "./presentation/controllers/otpControllers/VerifyOtpController";
import { ForgotPasswordController } from "./presentation/controllers/passwordControllers/ForgotPasswordController";
import { UpdatePasswordController } from "./presentation/controllers/passwordControllers/UpdatePasswordController";
import { VerifyPasswordController } from "./presentation/controllers/passwordControllers/VerifyPasswordController";
import { SignupController } from "./presentation/controllers/signupControllers/SignupController";
import { AdminRefreshController } from "./presentation/controllers/tokenControllers/AdminRefreshController";
import { RefreshController } from "./presentation/controllers/tokenControllers/RefreshController";
import { ResetTokenController } from "./presentation/controllers/tokenControllers/ResetTokenController";
import { AuthMiddleware } from "./presentation/middlewares/AuthMiddleware";
import { RegistrationMiddleware } from "./presentation/middlewares/RegistrationMiddleware";
import { createAuthRoutes } from "./presentation/routes/auth.routes";

const userRepository = new UserRepository()
const redisRefreshTokenRepo = new RedisRefreshTokenRepository()
const passwordResetTokenRepo = new PasswordResetTokenRepository()

const passwordService = new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()
const jwtService = new JwtService()
const cryptoService = new CryptoService()
const authService = new GoogleAuthService()

const registerUserUsecase = new RegisterUserUsecase(userRepository, passwordService, otpService, emailService, jwtService)
const verifyOtpUsecase = new VerifyOtpUsecase(userRepository, otpService)
const resendOtpUsecase = new ResendOtpUsecase(userRepository, otpService, emailService)
const loginUserUsecase = new LoginUserUsecase(userRepository, passwordService, jwtService, redisRefreshTokenRepo)
const logoutUserUsecase = new LogoutUserUseCase(redisRefreshTokenRepo)
const refreshTokenUsercase = new RefreshTokenUsecase(jwtService, redisRefreshTokenRepo, userRepository)
const otpStatusUseCase = new OtpStatusUsecase(otpService)
const getProfileUseCase = new GetProfileUsecase(userRepository)
const forgotPasswordUsecase = new ForgotPasswordUsecase(userRepository, emailService, cryptoService, passwordResetTokenRepo)
const updatePasswordUsecase = new UpdatePasswordUsecase(userRepository, passwordService, passwordResetTokenRepo, cryptoService)
const verifyResetTokenUsecase = new VerifyResetTokenUsecase(cryptoService, passwordResetTokenRepo)
const signInWithGoogle = new SignInWithGoogleUsecase(authService, userRepository, jwtService, redisRefreshTokenRepo)
const verifyPasswordUsecase = new VerifyPasswordUsecase(userRepository, emailService, cryptoService, passwordResetTokenRepo, passwordService)

const signupController = new SignupController(registerUserUsecase)
const loginController = new LoginController(loginUserUsecase)
const verifyOtpController = new VerifyOtpController(verifyOtpUsecase)
const resentOtpController = new ResentOtpController(resendOtpUsecase, otpStatusUseCase)
const otpStatusController = new OtpStatusController(otpStatusUseCase)
const logoutController = new LogoutController(logoutUserUsecase)
const forgotPasswordController = new ForgotPasswordController(forgotPasswordUsecase)
const updatePasswordController = new UpdatePasswordController(updatePasswordUsecase)
const verifyPasswordController = new VerifyPasswordController(verifyPasswordUsecase)
const refreshController = new RefreshController(refreshTokenUsercase)
const resetTokenController = new ResetTokenController(verifyResetTokenUsecase)
const meController = new Me(getProfileUseCase)
const googleController = new GoogleController(signInWithGoogle)
const adminRefreshController = new AdminRefreshController(refreshTokenUsercase)

const authController = {
    loginController,
    signupController,
    verifyOtpController,
    resentOtpController,
    otpStatusController,
    logoutController,
    forgotPasswordController,
    updatePasswordController,
    verifyPasswordController,
    refreshController,
    resetTokenController,
    meController,
    googleController,
    adminRefreshController
}
 



export type AuthController = typeof authController 
export const authMiddleware = new AuthMiddleware(jwtService)
export const registrationMiddleware = new RegistrationMiddleware(jwtService)

export const authRoute = createAuthRoutes(authController, authMiddleware, registrationMiddleware)