export interface LoginResponseDto{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string,
        name: string,
        email: string,
        role: string,
        googleId: string,
        profilePhotoUrl:string
    }
}