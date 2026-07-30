import { NextFunction, Request, Response } from "express"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"
import { IUsecase } from "../../../application/interfaces/IUsecase"

export class OtpStatusController{
    constructor(
        private readonly otpStatusUseCase: IUsecase<string, object>,
    ) { }
    
    otpStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.registration) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            const data = await this.otpStatusUseCase.execute(req.registration?.email)
            
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_STATUS, data)
        } catch (error) {
            next(error)
        }
    }
}