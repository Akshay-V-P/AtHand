import { UserRole } from "../enum/UserRole";

export interface JwtPayload{
    id: string;
    role: UserRole[];
    sessionId: string;
}

export interface RegTokenPayload{
    email:string
}
export interface ITokenService{
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    generateRegistrationToken(payload: RegTokenPayload): string;
    verifyAccessToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
    verifyRegistrationToken(token: string): RegTokenPayload;
}
