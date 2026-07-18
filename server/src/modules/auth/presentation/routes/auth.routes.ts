import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export function createAuthRoutes(authController: AuthController): Router{
    const router = Router()
    router.post('/signup', authController.signup)
    router.post('/verify-otp', authController.verifyOtp)
    router.post('/resend-otp', authController.resendOtp)
    return router
}