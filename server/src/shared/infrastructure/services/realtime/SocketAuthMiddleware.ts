import { Socket } from "socket.io";
import { ITokenService } from "../../../../modules/auth/domain/services/ITokenService";
import { NextFunction } from "express";

export class SocketAuthMiddleware{
    constructor(
        private readonly tokenService: ITokenService
    ) { }
    
    authenticate = (socket: Socket, next: (err?:Error)=>void): void => {
        try {
            const cookieHeader = socket.handshake.headers.cookie

            if (!cookieHeader) {
                return next(new Error("Authenticatin Required"))
            }

            const cookies = Object.fromEntries(
                cookieHeader.split(";").map((cookie) => {
                    const [key, ...value] = cookie.trim().split("=");
                    return [key, decodeURIComponent(value.join("="))];
                })
            );

            const token = cookies.accessToken

            if (!token) {
                return next(new Error("Access token missing"))
            }

            const payload = this.tokenService.verifyAccessToken(token)

            socket.data.user = payload

            next()
        } catch {
            next(new Error("Invalid token"))
        }
    }
}