export interface LoginResponseDto{
    accessToken: string;
    refreshToken: string;
    user: {
        _id: string,
        name: string,
        email: string,
        role:string
    }
}