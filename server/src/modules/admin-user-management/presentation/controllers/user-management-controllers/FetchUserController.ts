import {
    NextFunction,
    Request,
    Response
} from "express";

import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { User } from "../../../../auth/domain/entities/User";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { GetUsersDTO } from "../../../application/dtos/GetUserDTO";
import { USER_MANG_MSG } from "../../constants/USER_MANG_MSG";

export class FetchUsersController {

    constructor(
        private readonly fetchUsersUsecase:
            IUsecase<
                GetUsersDTO,
                PaginatedResult<User>
            >
    ) {}

    fetchUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const query = req.query;

            const page =
                Number(query.page) || 1;

            const limit =
                Number(query.limit) <= 10
                    ? Number(query.limit)
                    : 10;

            const search =
                typeof query.search === "string"
                    ? query.search
                    : undefined;

            const users =
                await this.fetchUsersUsecase.execute({
                    page,
                    limit,
                    search
                });

            ResponseHandler.success(
                res,
                HttpStatus.OK,
                USER_MANG_MSG.FETCHED_USERS,
                users
            );

        } catch (error) {
            next(error);
        }
    };
}