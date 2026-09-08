import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export interface UpdateUserProfileDto {
    id: string;
    name?: string;
    phone?: string;
    profilePhotoUrl?: string; // Ideally this is the full URL or a public S3 URL after formatting
}

export class UpdateUserProfileUsecase implements IUsecase<UpdateUserProfileDto, Omit<User, "password">> {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async execute(data: UpdateUserProfileDto): Promise<Omit<User, "password">> {
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.phone) updateData.phone = data.phone;
        if (data.profilePhotoUrl) {
            let url = data.profilePhotoUrl;
            
            updateData.profilePhotoUrl = url;
        }

        const updatedUser = await this.userRepository.update(data.id, updateData);
        if (!updatedUser) {
            throw new NotFoundError("User not found");
        }

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}
