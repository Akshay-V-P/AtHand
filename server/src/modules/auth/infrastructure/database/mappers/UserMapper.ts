import { User } from "../../../domain/entities/User";

export class UserMapper{
    static toDomain(user: any): User{
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.phone,
            user.password,
            user.role,
            user.status,
            user.isVerified
        )
    }
}