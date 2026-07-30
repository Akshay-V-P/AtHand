import { NextFunction, Request, Response } from "express"
import { LoginResponseDto } from "../../../application/dto/LoginResponseDto"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class GoogleController{
    constructor(
        
        private readonly signInWithGoogleUsecase: IUsecase<string, LoginResponseDto>,
    ) { }
    
    google = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.body
            if (!token) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.INVALID_TOKEN)
                return
            }
            const data = await this.signInWithGoogleUsecase.execute(token)
            const {refreshToken, accessToken,  ...responseData} = data
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:7*24*60*60*1000
            })
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:15*60*1000
            })
            console.log(responseData)
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LOGIN_SUCCESS, responseData)
        } catch (error) {
            next(error)
        }
    }
}