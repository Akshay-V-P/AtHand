import { NextFunction, Request, Response } from "express";
import { RegisterDto } from "../../application/dto/RegisterDto";
import { OtpVerifyDto } from "../../application/dto/OtpVerifyDto";
import { ResendOtpDto } from "../../application/dto/ResendOtpDto";
import { LoginDto } from "../../application/dto/LoginDto";
import { ILoginUserUsecase } from "../../application/interfaces/ILoginUserUsecase";
import { IRegisterUserUsecase } from "../../application/interfaces/IRegisterUserUsecase";
import { IVerifyOtpUsecase } from "../../application/interfaces/IVerifyOtpUsecase";
import { IOtpStatusUsecase } from "../../application/interfaces/IOtpStatusUsecase";
import { ILogoutUserUsecase } from "../../application/interfaces/ILogoutUserUsecase";
import { IResendOtpUsecase } from "../../application/interfaces/IResendOtpUsecase";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { AUTH_MESSAGES } from "../constants/authMessage";
import { IGetProfileUsecase } from "../../application/interfaces/IGetProfileUsecase";
import { IRefreshTokenUsecase } from "../../application/interfaces/IRefreshTokenUsecase";
import { IForgotPasswordUsecase } from "../../application/interfaces/IForgotPasswordUsecase";
import { IUpdatePasswordUsecase } from "../../application/interfaces/IUpdatePasswordUsecase";
import { IVerifyResetTokenUsecase } from "../../application/interfaces/IVerifyResetTokenUsecase";

export class AuthController {
    constructor(
        private readonly registerUseCase: IRegisterUserUsecase,
        private readonly verifyOtpUseCase: IVerifyOtpUsecase,
        private readonly resendOtpUseCase: IResendOtpUsecase,
        private readonly loginUserUseCase: ILoginUserUsecase,
        private readonly logoutUserUserCase: ILogoutUserUsecase,
        private readonly refreshTokenUseCase: IRefreshTokenUsecase,
        private readonly otpStatusUseCase: IOtpStatusUsecase,
        private readonly getProfileUseCase: IGetProfileUsecase,
        private readonly forgotPasswordUsecase: IForgotPasswordUsecase,
        private readonly updatePasswordUsecase: IUpdatePasswordUsecase,
        private readonly verifyResetTokenUsecase:IVerifyResetTokenUsecase,
    ) { }
    
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const dto:RegisterDto = req.body
            const registered = await this.registerUseCase.execute(dto)
            
            res.cookie('registrationToken', registered.registrationToken, {
                httpOnly: true,
                secure:false,
                sameSite: 'lax',
                maxAge:15*60*60*1000
            })
            if (!registered.newRegister) {
                ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.USER_ALREADY_EXISTS_VERIFY)
                return
            }
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_SENT)
        } catch (error) {
            next(error)
        }
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            if (!req.registration) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.SESSION_EXPIRED)
                return
            }
            const dto: OtpVerifyDto = {
                email: req.registration.email,
                otp:req.body.otp
            }
            await this.verifyOtpUseCase.execute(dto)
            res.clearCookie("registrationToken", {
                httpOnly: true,
                secure: false,
                sameSite:"lax"
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_VERIFIED)
        } catch (error) {
            next(error)
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.registration) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.SESSION_EXPIRED)
                return
            }
            const dto: ResendOtpDto = req.registration
            await this.resendOtpUseCase.execute(dto)
            const data = await this.otpStatusUseCase.execute(req.registration.email)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_RESENT, data)
        } catch (error) {
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hasAccessToken = req.cookies.accessToken
            if (hasAccessToken) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.SESSION_EXISTS)
                return
            }
            const dto:LoginDto = req.body
            const data = await this.loginUserUseCase.execute(dto)
            const {refreshToken, accessToken,  ...responseData} = data
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:7*24*60*60*1000
            })
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:15*60*1000
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LOGIN_SUCCESS, responseData)
        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            await this.logoutUserUserCase.execute(req.user.id, req.user.sessionId)
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "lax",
                secure:false
            })
            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "lax",
                secure:false
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LOGOUT_SUCCESS)
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken)
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge:15*60*1000
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.ACCESS_TOKEN_REFRESHED)
        } catch (error) {
            next(error)
        }
    }

    otpStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.registration) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            await this.otpStatusUseCase.execute(req.registration?.email)
            
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_STATUS)
        } catch (error) {
            next(error)
        }
    }

    me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.getProfileUseCase.execute(req.user?.id!)
            if (!user) {
                ResponseHandler.error(res, HttpStatus.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND)
                return
            }
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.STATE_REFRESHED, user)
        } catch (error) {
            next(error)
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.body.email) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.PROVIDE_EMAIL)
                return
            }
            await this.forgotPasswordUsecase.execute(req.body.email)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LINK_SENT)
        } catch (error) {
            next(error)
        }
    }

    verifyResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.body
            if (!token) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.INVALID_TOKEN)
                return
            }
            await this.verifyResetTokenUsecase.execute(token)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.SESSION_EXISTS)
        } catch (error) {
            next(error)
        }
    }

    updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = typeof req.params.token === "string" ? req.params.token : undefined;
            const { newPassword } = req.body
            
            if (!token) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.INVALID_LINK)
                return
            }
            if (!newPassword || newPassword.trim().length < 8) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.NEWPASSWORD_REQUIRED)
                return
            }
            await this.updatePasswordUsecase.execute(token, newPassword)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.PASSWORD_UPDATED)
        } catch (error) {
            next(error)
        }
    }
}