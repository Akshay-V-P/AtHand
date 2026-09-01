import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";

export class BlockUserUsecase
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

        if (user.status === "BLOCKED") {
            throw new Error(
                "User is already blocked"
            );
        }

        const updatedUser =
            await this.userRepository.updateStatus(
                id,
                "BLOCKED"
            );

        if (!updatedUser) {
            throw new Error(
                "Failed to block user"
            );
        }
    }
}