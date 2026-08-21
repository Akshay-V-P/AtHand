import { UserRole } from "../../domain/enum/UserRole";

export interface UserUpdateDto{
    name?: string,
    phone?: string,
    password?: string,
    role?: UserRole[],
    status?: string,
    isVerified?:boolean
}