import { User } from "../entities/User";

interface UserUpdateData{
    name?: string,
    phone?: string,
    password?: string,
    role?: string,
    status?: string,
    isVerified?:boolean
}

export interface IUserRepository{
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, updateData: UserUpdateData): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}