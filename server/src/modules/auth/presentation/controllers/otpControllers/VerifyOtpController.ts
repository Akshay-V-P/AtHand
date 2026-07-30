import { NextFunction, Request, Response } from "express";
import { OtpVerifyDto } from "../../../application/dto/OtpVerifyDto";
import { IUsecase } from "../../../application/interfaces/IUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { AUTH_MESSAGES } from "../../constants/authMessage";

export class VerifyOtpController{
    constructor(
        private readonly verifyOtpUseCase: IUsecase<OtpVerifyDto, void>,
    ) { }
    
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
}