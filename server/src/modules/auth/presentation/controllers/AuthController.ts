import { NextFunction, Request, Response } from "express";
import { RegisterUserUsecase } from "../../application/usecases/RegisterUserUsecase";
import { VerifyOtpUsecase } from "../../application/usecases/VerifyOtpUsecase";
import { RegisterDto } from "../../application/dto/RegisterDto";
import { OtpVerifyDto } from "../../application/dto/OtpVerifyDto";
import { ResendOtpUsecase } from "../../application/usecases/ResendOtpUsecase";
import { ResendOtpDto } from "../../application/dto/ResendOtpDto";

export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUserUsecase,
        private readonly verifyOtpUseCase: VerifyOtpUsecase,
        private readonly resendOtpUseCase:ResendOtpUsecase
    ) { }
    
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const dto:RegisterDto = req.body
            await this.registerUseCase.execute(dto)
            res.status(201).json({ success: true, message:"OTP send successfully"})
        } catch (error) {
            next(error)
        }
    }

    verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const dto:OtpVerifyDto = req.body
            await this.verifyOtpUseCase.execute(dto)
            res.status(200).json({success:true, message:"OTP verified successfully"})
        } catch (error) {
            next(error)
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: ResendOtpDto = req.body
            await this.resendOtpUseCase.execute(dto)
            res.status(200).json({success:true, message:"OTP resended"})
        } catch (error) {
            next(error)
        }
    }
}