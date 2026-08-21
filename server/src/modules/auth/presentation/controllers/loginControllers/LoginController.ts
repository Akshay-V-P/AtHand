import { NextFunction, Request, Response } from "express"
import { LoginDto } from "../../../application/dto/LoginDto"
import { LoginResponseDto } from "../../../application/dto/LoginResponseDto"
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { AUTH_MESSAGES } from "../../constants/authMessage"
import { UserRole } from "../../../domain/enum/UserRole"
import { AuthContext } from "../../../domain/enum/AuthContext"

export class LoginController{
    constructor(
        private readonly loginUserUseCase: IUsecase<LoginDto, LoginResponseDto>,
    ) { }
    
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto:LoginDto = req.body
            let hasAccessToken = req.cookies.accessToken
            if (dto.context == AuthContext.ADMIN) {
                hasAccessToken = req.cookies.adminAccessToken
            }
            
            if (hasAccessToken) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.SESSION_EXISTS)
                return
            }
            
            const data = await this.loginUserUseCase.execute(dto)
            const { refreshToken, accessToken, ...responseData } = data
            
            let refreshTokenName = "refreshToken"
            let accessTokenName = "accessToken"

            if (dto.context == AuthContext.ADMIN) {
                refreshTokenName = "adminRefreshToken"
                accessTokenName = "adminAccessToken"
            }

            res.cookie(refreshTokenName, refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:7*24*60*60*1000
            })
            res.cookie(accessTokenName, accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge:15*60*1000
            })
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.LOGIN_SUCCESS, responseData)
        } catch (error) {
            next(error)
        }
    }
}