import { UserUpdateDto } from "../../application/dto/UserUpdateDto";
import { User } from "../entities/User";

export interface IUserRepository{
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, updateData: UserUpdateDto): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}