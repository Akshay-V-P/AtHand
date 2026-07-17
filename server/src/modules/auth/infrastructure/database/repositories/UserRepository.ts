import { UserUpdateDto } from "../../../application/dto/UserUpdateDto";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import UserModel from "../models/UserModel";

export class UserRepository implements IUserRepository{
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email })
        if (!user) return null
        return UserMapper.toDomain(user)
    }

    async create(user: User): Promise<User> {
        const newUser = new UserModel({
            name:user.name,
            email:user.email,
            phone:user.phone,
            password: user.password,
            role: user.role,
            status:user.status,
            isVerified:user.isVerified
        })
        await newUser.save()
        return UserMapper.toDomain(newUser)
    }

    async update(id: string, updateData: UserUpdateDto): Promise<User | null> {
        const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true })
        if(!user) return null
        return UserMapper.toDomain(user)
    }
}