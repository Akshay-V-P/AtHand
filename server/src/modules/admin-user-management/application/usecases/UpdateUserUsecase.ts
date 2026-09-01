import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { UserUpdateDto } from "../../../auth/application/dto/UserUpdateDto";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";

interface UpdateUserInput {
    id: string;
    data: UserUpdateDto;
}

export class UpdateUserUsecase implements IUsecase<UpdateUserInput, void>{
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(input: UpdateUserInput): Promise<void> {

        const { id, data } = input;

        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser =
            await this.userRepository.update(
                id,
                {
                    name: data.name,
                    phone: data.phone
                }
            );

        if (!updatedUser) {
            throw new Error(
                "Failed to update user"
            );
        }
    }
}