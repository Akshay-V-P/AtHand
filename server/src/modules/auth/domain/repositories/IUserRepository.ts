import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { User } from "../entities/User";
import { UserRole } from "../enum/UserRole";

interface UserUpdateData{
    name?: string,
    phone?: string,
    password?: string,
    role?: UserRole[],
    status?: string,
    isVerified?:boolean
}

export interface IUserRepository{
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, updateData: UserUpdateData): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateStatus(
        id: string,
        status: "ACTIVE" | "BLOCKED"
    ): Promise<User | null>;
    findAll(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginatedResult<User>>;
}