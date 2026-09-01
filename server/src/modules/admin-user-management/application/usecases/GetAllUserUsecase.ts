import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

import { User } from "../../../auth/domain/entities/User";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { GetUsersDTO } from "../dtos/GetUserDTO";


export class GetAllUsersUsecase implements IUsecase< GetUsersDTO, PaginatedResult<User>>{
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(
        data: GetUsersDTO
    ): Promise<PaginatedResult<User>> {

        const {
            page,
            limit,
            search
        } = data;

        if (page < 1) {
            throw new Error(
                "Page must be greater than 0"
            );
        }

        if (limit < 1) {
            throw new Error(
                "Limit must be greater than 0"
            );
        }

        return await this.userRepository.findAll(
            page,
            limit,
            search
        );
    }
}