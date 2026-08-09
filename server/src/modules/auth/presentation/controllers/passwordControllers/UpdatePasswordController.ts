import { NextFunction, Request, Response } from "express"
import { UpdatePasswordDto } from "../../../application/dto/UpdatePasswordDto"
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class UpdatePasswordController{
    constructor(
        
        private readonly updatePasswordUsecase: IUsecase<UpdatePasswordDto, void>,
    ) { }
    
    updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const { password, token } = req.body
            
            if (!token) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.INVALID_LINK)
                return
            }
            if (!password || password.trim().length < 8) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.NEWPASSWORD_REQUIRED)
                return
            }
            await this.updatePasswordUsecase.execute({ token, newPassword: password })
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
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.PASSWORD_UPDATED)
        } catch (error) {
            next(error)
        }
    }
}