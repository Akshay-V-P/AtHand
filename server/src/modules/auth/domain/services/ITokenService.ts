export interface JwtPayload{
    id: string;
    role: string;
    sessionId: string;
}
export interface ITokenService{
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    verifyAccessToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
}
