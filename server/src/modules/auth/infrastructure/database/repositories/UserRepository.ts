import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { UserUpdateDto } from "../../../application/dto/UserUpdateDto";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import UserModel,{ UserSchemaType } from "../models/UserModel";

export class UserRepository extends BaseRepository<UserSchemaType> implements IUserRepository{

    constructor() {
        super(UserModel)
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.findDocumentByEmail(email)
        if (!user) return null
        return UserMapper.toDomain(user)
    }

    async create(user: User): Promise<User> {
        const newUser = {
            name:user.name,
            email:user.email,
            phone:user.phone,
            password: user.password,
            role: user.role,
            status:user.status,
            isVerified: user.isVerified,
            googleId: user.googleId,
            profilePhotoUrl:user.profilePhotoUrl
        }
        const freshUser = await this.createDocument(newUser)
        return UserMapper.toDomain(freshUser)
    }

    async update(id: string, updateData: UserUpdateDto): Promise<User | null> {
        
        const user = await this.updateDocument(id, updateData)
        if(!user) return null
        return UserMapper.toDomain(user)
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.findDocumentById(id)
        if (!user) return null
        return UserMapper.toDomain(user)
    }
}



