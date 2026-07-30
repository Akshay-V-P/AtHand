import { NextFunction, Request, Response } from "express";
import { ResendOtpDto } from "../../../application/dto/ResendOtpDto";
import { IUsecase } from "../../../application/interfaces/IUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { AUTH_MESSAGES } from "../../constants/authMessage";

export class ResentOtpController{
    constructor(
        private readonly resendOtpUseCase: IUsecase<ResendOtpDto, void>,
        private readonly otpStatusUseCase: IUsecase<string, object>,
    ) { }
    
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
}