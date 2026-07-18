import { RegisterUserUsecase } from "./application/usecases/RegisterUserUsecase";
import { ResendOtpUsecase } from "./application/usecases/ResendOtpUsecase";
import { VerifyOtpUsecase } from "./application/usecases/VerifyOtpUsecase";
import { UserRepository } from "./infrastructure/database/repositories/UserRepository";
import { EmailService } from "./infrastructure/services/EmailService";
import { OtpService } from "./infrastructure/services/OtpService";
import { PasswordService } from "./infrastructure/services/PasswordService";
import { AuthController } from "./presentation/controllers/AuthController";
import { createAuthRoutes } from "./presentation/routes/auth.routes";

const userRepository = new UserRepository()

const passwordService = new PasswordService()
const emailService = new EmailService()
const otpService = new OtpService()

const registerUserUsecase = new RegisterUserUsecase(userRepository, passwordService, otpService, emailService)
const verifyOtpUsecase = new VerifyOtpUsecase(userRepository, otpService)
const resendOtpUsecase = new ResendOtpUsecase(userRepository, otpService, emailService)

const authController = new AuthController(registerUserUsecase, verifyOtpUsecase, resendOtpUsecase)

export const authRoute = createAuthRoutes(authController)