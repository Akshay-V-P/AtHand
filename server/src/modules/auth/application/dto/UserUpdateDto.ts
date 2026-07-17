export interface UserUpdateDto{
    name?: string,
    phone?: string,
    password?: string,
    role?: string,
    status?: string,
    isVerified?:boolean
}