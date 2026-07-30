import { NextFunction, Request, Response } from "express"
import { GetProfileDto } from "../../../application/dto/GetProfileDto"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class Me{
    constructor(
        private readonly getProfileUseCase: IUsecase<string, GetProfileDto|null>,
    ) { }
    
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
}