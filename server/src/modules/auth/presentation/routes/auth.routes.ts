import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RegistrationMiddleware } from "../middlewares/RegistrationMiddleware";

export function createAuthRoutes(authController: AuthController, authMiddleware:AuthMiddleware, registrationMiddleware:RegistrationMiddleware): Router{
    const router = Router()
    router.post('/signup', authController.signup)
    router.post('/verify-otp',registrationMiddleware.execute, authController.verifyOtp)
    router.get('/otp-status',registrationMiddleware.execute, authController.otpStatus)
    router.post('/resend-otp',registrationMiddleware.execute, authController.resendOtp)
    router.post('/login', authController.login)
    router.post('/logout', authMiddleware.execute, authController.logout)
    router.post('/refresh', authController.refresh)
    return router
}