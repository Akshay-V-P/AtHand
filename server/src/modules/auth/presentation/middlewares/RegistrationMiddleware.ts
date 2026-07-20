import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/services/ITokenService";

export class RegistrationMiddleware{
    constructor(
        private readonly tokenService:ITokenService
    ) { }
    
    execute = (req:Request, res:Response, next:NextFunction):void => {
        const token = req.cookies.registrationToken
        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized" })
            return
        }

        try {
            const payload = this.tokenService.verifyRegistrationToken(token)
            req.registration = payload
            next()
        } catch (error) {
            res.status(401).json({success:false, message:"Invalid token"})
        }
    }
}