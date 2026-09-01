import {
    NextFunction,
    Request,
    Response
} from "express";

import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";

import { User } from "../../../../auth/domain/entities/User";

import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";

import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { USER_MANG_MSG } from "../../constants/USER_MANG_MSG";

export class GetUserController {

    constructor(
        private readonly getUserUsecase:
            IUsecase<string, User>
    ) {}

    getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params as {id:string}

            const user =
                await this.getUserUsecase.execute(id);

            ResponseHandler.success(
                res,
                HttpStatus.OK,
                USER_MANG_MSG.FETCHED_USER,
                user
            );

        } catch (error) {
            next(error);
        }
    };
}