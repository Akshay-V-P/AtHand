import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/services/ITokenService";

export class AuthMiddleware{
    constructor(
        private readonly tokenService:ITokenService
    ) { }
    
    execute = (req: Request, res: Response, next: NextFunction):void => {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return
        }

        const token = authHeader.split(" ")[1]

        try {
            const payload = this.tokenService.verifyAccessToken(token)
            req.user = payload
            next()
        } catch (error) {
            res.status(401).json({ success: false, message: "invalid token" })
            return
        }
    }
}