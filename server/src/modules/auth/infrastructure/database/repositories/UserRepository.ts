import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { UserUpdateDto } from "../../../application/dto/UserUpdateDto";
import { User } from "../../../domain/entities/User";
import { UserRole } from "../../../domain/enum/UserRole";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import UserModel, { UserSchemaType } from "../models/UserModel";

export class UserRepository extends BaseRepository<UserSchemaType> implements IUserRepository {

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
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            googleId: user.googleId,
            profilePhotoUrl: user.profilePhotoUrl
        }
        const freshUser = await this.createDocument(newUser)
        return UserMapper.toDomain(freshUser)
    }

    async update(id: string, updateData: UserUpdateDto): Promise<User | null> {

        const user = await this.updateDocument(id, updateData)
        if (!user) return null
        return UserMapper.toDomain(user)
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.findDocumentById(id)
        if (!user) return null
        return UserMapper.toDomain(user)
    }

    async updateStatus(
        id: string,
        status: "ACTIVE" | "BLOCKED"
    ): Promise<User | null> {

        const user =
            await this.updateDocument(
                id,
                { status }
            );

        if (!user) return null;

        return UserMapper.toDomain(user);
    }

    async findAll(
        page: number,
        limit: number,
        search?: string,
        status?: string,
        isVerified?: string,
        sort?: string,
        sortOrder?: 'asc' | 'desc'
    ): Promise<PaginatedResult<User>> {

        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {
            role: {
                $nin: [UserRole.ADMIN]
            }
        };

        if (status) {
            filter.status = status;
        }

        if (isVerified === 'true' || isVerified === 'false') {
            filter.isVerified = isVerified === 'true';
        }

        if (search?.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    phone: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        let sortObj: any = {};
        if (sort) {
            sortObj[sort] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortObj = { createdAt: -1 };
        }

        const [users, totalItems] =
            await Promise.all([
                UserModel
                    .find(filter)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .lean(),

                UserModel.countDocuments(filter)
            ]);

        return {
            items: users.map(
                (user) => UserMapper.toDomain(user)
            ),

            totalItems,

            page,

            limit,

            totalPages: Math.ceil(
                totalItems / limit
            )
        };
    }
}



