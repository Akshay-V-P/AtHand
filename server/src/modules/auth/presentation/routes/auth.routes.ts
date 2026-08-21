import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RegistrationMiddleware } from "../middlewares/RegistrationMiddleware";
import { AUTH_ROUTE } from "../constants/routeConstants";
import { AuthController } from "../../container";

export function createAuthRoutes(authController: AuthController, authMiddleware:AuthMiddleware, registrationMiddleware:RegistrationMiddleware): Router{
    const router = Router()


    router.post(AUTH_ROUTE.SIGNUP, authController.signupController.signup)
    router.post(AUTH_ROUTE.VERIFY, registrationMiddleware.execute, authController.verifyOtpController.verifyOtp)
    router.get(AUTH_ROUTE.OTPSTATUS, registrationMiddleware.execute, authController.otpStatusController.otpStatus)
    router.post(AUTH_ROUTE.RESEND, registrationMiddleware.execute, authController.resentOtpController.resendOtp)
    router.post(AUTH_ROUTE.LOGIN, authController.loginController.login)
    router.post(AUTH_ROUTE.LOGOUT, authMiddleware.execute, authController.logoutController.logout)
    router.get(AUTH_ROUTE.REFRESH,  authController.refreshController.refresh)
    router.post(AUTH_ROUTE.ME, authMiddleware.execute, authController.meController.me)
    router.post(AUTH_ROUTE.FORGOT_PASSWORD, authController.forgotPasswordController.forgotPassword)
    router.post(AUTH_ROUTE.UPDATE_PASSWORD, authController.updatePasswordController.updatePassword)
    router.post(AUTH_ROUTE.VERIFY_RESET_TOKEN, authController.resetTokenController.verifyResetToken)
    router.post(AUTH_ROUTE.GOOGLE, authController.googleController.google)
    router.post(AUTH_ROUTE.VERIFY_PASSWORD, authMiddleware.execute, authController.verifyPasswordController.verifyPassword)
    router.post(AUTH_ROUTE.ADMIN_REFRESH, authController.adminRefreshController.refresh)

    return router
}