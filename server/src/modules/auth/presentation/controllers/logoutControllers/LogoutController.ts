import { NextFunction, Request, Response } from "express"
import { LogoutDto } from "../../../application/dto/LogoutDto"
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"
import { AuthClient } from "google-auth-library"
import { AuthContext } from "../../../domain/enum/AuthContext"

export class LogoutController{
    constructor(
        private readonly logoutUserUserCase: IUsecase<LogoutDto, void>,
    ) { }
    
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {context} = req.body
            if (!req.user) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED)
                return
            }
            await this.logoutUserUserCase.execute({ id: req.user.id, sessionId: req.user.sessionId, context })

            let refreshTokenName = "refreshToken"
            let accessTokenName = "accessToken"

            if (context == AuthContext.ADMIN) {
                refreshTokenName = "adminRefreshToken"
                accessTokenName  ="adminAccessToken"
            }
            
            res.clearCookie(refreshTokenName, {
                httpOnly: true,
                sameSite: "lax",
                secure:false
            })
            res.clearCookie(accessTokenName, {
                httpOnly: true,
                sameSite: "lax",
                secure:false
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LOGOUT_SUCCESS)
        } catch (error) {
            next(error)
        }
    }
}