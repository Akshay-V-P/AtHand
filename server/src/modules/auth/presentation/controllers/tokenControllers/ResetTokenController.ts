import { NextFunction, Request, Response } from "express"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class ResetTokenController{
    constructor(
        
        private readonly verifyResetTokenUsecase: IUsecase<string, void>,
    ) { }
    
    verifyResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.body
            console.log(token)
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
}