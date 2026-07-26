import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RegistrationMiddleware } from "../middlewares/RegistrationMiddleware";
import { AUTH_ROUTE } from "../constants/routeConstants";

export function createAuthRoutes(authController: AuthController, authMiddleware:AuthMiddleware, registrationMiddleware:RegistrationMiddleware): Router{
    const router = Router()
    router.post(AUTH_ROUTE.SIGNUP, authController.signup)
    router.post(AUTH_ROUTE.VERIFY, registrationMiddleware.execute, authController.verifyOtp)
    router.get(AUTH_ROUTE.OTPSTATUS, registrationMiddleware.execute, authController.otpStatus)
    router.post(AUTH_ROUTE.RESEND, registrationMiddleware.execute, authController.resendOtp)
    router.post(AUTH_ROUTE.LOGIN, authController.login)
    router.post(AUTH_ROUTE.LOGOUT, authMiddleware.execute, authController.logout)
    router.post(AUTH_ROUTE.REFRESH, authMiddleware.execute, authController.refresh)
    router.post(AUTH_ROUTE.ME, authMiddleware.execute, authController.me)
    router.post(AUTH_ROUTE.FORGOT_PASSWORD, authController.forgotPassword)
    router.post(AUTH_ROUTE.UPDATE_PASSWORD, authController.updatePassword)
    router.post(AUTH_ROUTE.VERIFY_RESET_TOKEN, authController.verifyResetToken)
    return router
}