import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { User } from "../../../auth/domain/entities/User";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";

export class GetUserUsecase
    implements IUsecase<string, User>
{
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<User> {
        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}