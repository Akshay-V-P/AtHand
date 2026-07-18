import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export function createAuthRoutes(authController: AuthController, authMiddleware:AuthMiddleware): Router{
    const router = Router()
    router.post('/signup', authController.signup)
    router.post('/verify-otp', authController.verifyOtp)
    router.post('/resend-otp', authController.resendOtp)
    router.post('/login', authController.login)
    router.post('/logout',authMiddleware.execute,  authController.logout)
    return router
}