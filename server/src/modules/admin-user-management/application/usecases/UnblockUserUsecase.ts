import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";

export class UnblockUserUsecase
    implements IUsecase<string, void>
{
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<void> {

        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.status === "ACTIVE") {
            throw new Error(
                "User is already active"
            );
        }

        const updatedUser =
            await this.userRepository.updateStatus(
                id,
                "ACTIVE"
            );

        if (!updatedUser) {
            throw new Error(
                "Failed to unblock user"
            );
        }
    }
}