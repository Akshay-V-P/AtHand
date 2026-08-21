import { UserRole } from "../../domain/enum/UserRole";

export interface LoginResponseDto{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string,
        name: string,
        email: string,
        role: UserRole[],
        googleId: string,
        profilePhotoUrl:string
    }
}