import {
    NextFunction,
    Request,
    Response
} from "express";

import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";

import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";

import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { USER_MANG_MSG } from "../../constants/USER_MANG_MSG";

export class BlockUserController {

    constructor(
        private readonly blockUserUsecase:
            IUsecase<string, void>
    ) {}

    blockUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params as {id:string}

            await this.blockUserUsecase.execute(id);

            ResponseHandler.success(
                res,
                HttpStatus.OK,
                USER_MANG_MSG.USER_BLOCKED
            );

        } catch (error) {
            next(error);
        }
    };
}