import { NextFunction, Request, Response } from "express"
import { IUsecase } from "../../../application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"

export class RefreshController{
    constructor(
        
        private readonly refreshTokenUseCase: IUsecase<string, string>,
    ) { }
    
    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken)
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge:15*60*1000
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.ACCESS_TOKEN_REFRESHED)
        } catch (error) {
            next(error)
        }
    }
}