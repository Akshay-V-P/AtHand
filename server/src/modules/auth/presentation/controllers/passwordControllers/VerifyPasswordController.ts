import { NextFunction, Request, Response } from "express"
import { VerifyPasswordDto } from "../../../application/dto/VerifyPasswordDto"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class VerifyPasswordController{
    constructor(
        
        private readonly verifyPasswordUsecase: IUsecase<VerifyPasswordDto, void>,
    ) { }
    
    verifyPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.body?.email || !req.body?.password) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.PROVIDE_EMAIL)
                return
            }
            await this.verifyPasswordUsecase.execute({ email:req.body.email, password:req.body.password })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LINK_SENT)
        } catch (error) {
            next(error)
        }
    }
}