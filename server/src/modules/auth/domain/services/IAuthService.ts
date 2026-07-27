export interface AuthServiceResponse{
    name: string;
    email: string;
    picture?: string;
    googleId?: string;
}

export interface IAuthService{
    verifyToken(token:string):Promise<AuthServiceResponse | null>
}