import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/services/ITokenService";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class AuthMiddleware{
    constructor(
        private readonly tokenService:ITokenService
    ) { }
    
    execute = (req: Request, res: Response, next: NextFunction):void => {
        const token = req.cookies.accessToken

        if (!token) {
            ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Invalid token")
            return
        }

        try {
            const payload = this.tokenService.verifyAccessToken(token)
            req.user = payload
            next()
        } catch (error) {
            res.status(401).json({ success: false, message: "invalid token" })
            console.log(error)
            return
        }
    }
}