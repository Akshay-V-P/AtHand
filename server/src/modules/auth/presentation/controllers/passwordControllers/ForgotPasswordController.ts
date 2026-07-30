import { NextFunction, Request, Response } from "express"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class ForgotPasswordController{
    constructor(
        
        private readonly forgotPasswordUsecase: IUsecase<string, void>,
    ) { }
    
    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.body?.email) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.PROVIDE_EMAIL)
                return
            }
            await this.forgotPasswordUsecase.execute(req.body.email)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LINK_SENT)
        } catch (error) {
            next(error)
        }
    }
}