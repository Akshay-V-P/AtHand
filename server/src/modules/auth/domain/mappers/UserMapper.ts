import { GetProfileDto } from "../../application/dto/GetProfileDto";
import { User } from "../entities/User";

export class UserMapper{
    // TODO: dto issue
    static toGetProfileDTO(user: User): GetProfileDto{
        return {
            id: user.id!,
            name: user.name,
            email: user.email,
            role: user.role,
            googleId: user.googleId,
            profilePhotoUrl:user.profilePhotoUrl
        }
    }
}