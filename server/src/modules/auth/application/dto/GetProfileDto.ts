import { UserRole } from "../../domain/enum/UserRole";

export interface GetProfileDto{
    id: string;
    name: string;
    email: string;
    role: UserRole[];
    googleId?: string;
    profilePhotoUrl?: string;
}