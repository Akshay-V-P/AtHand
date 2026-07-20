import { ITokenService, JwtPayload, RegTokenPayload } from "../../domain/services/ITokenService";
import jwt from "jsonwebtoken"


export class JwtService implements ITokenService{
    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn:process.env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn']
        })
    }

    generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn']
        })
    }

    generateRegistrationToken(payload: RegTokenPayload): string {
        return jwt.sign(payload, process.env.JWT_REGISTRATION_SECRET!, {
            expiresIn:process.env.JWT_REGISTRATION_EXPIRES as jwt.SignOptions['expiresIn']
        })
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload
    }

    verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload
    }

    verifyRegistrationToken(token: string): RegTokenPayload {
        return jwt.verify(token, process.env.JWT_REGISTRATION_SECRET!) as RegTokenPayload
    }
}