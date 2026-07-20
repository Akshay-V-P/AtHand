import { NextFunction, Request, Response } from "express";
import { RegisterUserUsecase } from "../../application/usecases/RegisterUserUsecase";
import { VerifyOtpUsecase } from "../../application/usecases/VerifyOtpUsecase";
import { RegisterDto } from "../../application/dto/RegisterDto";
import { OtpVerifyDto } from "../../application/dto/OtpVerifyDto";
import { ResendOtpUsecase } from "../../application/usecases/ResendOtpUsecase";
import { ResendOtpDto } from "../../application/dto/ResendOtpDto";
import { LoginUserUsecase } from "../../application/usecases/LoginUserUsecase";
import { LoginDto } from "../../application/dto/LoginDto";
import { LogoutUserUseCase } from "../../application/usecases/LogoutUserUseCase";
import { RefreshTokenUsecase } from "../../application/usecases/RefreshTokenUsecase";
import { OtpStatusUsecase } from "../../application/usecases/OtpStatusUsecase";
import { RegTokenPayload } from "../../domain/services/ITokenService";

export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUserUsecase,
        private readonly verifyOtpUseCase: VerifyOtpUsecase,
        private readonly resendOtpUseCase: ResendOtpUsecase,
        private readonly loginUserUseCase: LoginUserUsecase,
        private readonly logoutUserUserCase: LogoutUserUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUsecase,
        private readonly otpStatusUseCase:OtpStatusUsecase
    ) { }
    
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const dto:RegisterDto = req.body
            const registered = await this.registerUseCase.execute(dto)
            console.log(registered)
            res.cookie('registrationToken', registered.registrationToken, {
                httpOnly: true,
                secure:false,
                sameSite: 'lax',
                maxAge:15*60*60*1000
            })
            if (!registered.newRegister) {
                res.status(200).json({ success: true, message: "User already exists. Please verify email" })
                return
            }
            res.status(201).json({ success: true, message:"OTP send successfully"})
        } catch (error) {
            next(error)
        }
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            if (!req.registration) {
                res.status(401).json({ success: false, message: "Session expired" })
                return
            }
            const dto: OtpVerifyDto = {
                email: req.registration.email,
                otp:req.body.otp
            }
            await this.verifyOtpUseCase.execute(dto)
            res.status(200).json({success:true, message:"OTP verified successfully"})
        } catch (error) {
            next(error)
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.registration) {
                res.status(401).json({ success: false, message: "Session expired" })
                return
            }
            const dto: ResendOtpDto = req.registration
            await this.resendOtpUseCase.execute(dto)
            const data = await this.otpStatusUseCase.execute(req.registration.email)
            res.status(200).json({success:true, message:"OTP resended", data})
        } catch (error) {
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto:LoginDto = req.body
            const data = await this.loginUserUseCase.execute(dto)
            const {refreshToken, ...responseData} = data
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:7*24*60*60*1000
            })
            res.status(200).json({success:true, message:"Login succesfull", data:responseData})
        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: "Unauthorized" })
                return
            }
            await this.logoutUserUserCase.execute(req.user.id, req.user.sessionId)
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "lax",
                secure:false
            })
            res.status(200).json({success:true, message:"Logout success"})
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const authHeader = req.cookies.refreshToken
            if (!authHeader?.startsWith("Bearer ")) {
                res.status(401).json({ success: false, message: "Unauthorized" })
                return
            }
            const refreshToken = authHeader?.split(" ")[1]
            if (!refreshToken) {
                res.status(401).json({ success: false, message: "Unauthorized" })
                return
            }
            const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken)
            res.status(200).json({success:true, message:"New access token", data:newAccessToken})
        } catch (error) {
            next(error)
        }
    }

    otpStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.registration) {
                res.status(401).json({ success: false, message: "Unauthorized" })
                return
            }
            const data = await this.otpStatusUseCase.execute(req.registration?.email)
            
            res.status(200).json({success:true, message:"Otp status", data})
        } catch (error) {
            next(error)
        }
    }
}