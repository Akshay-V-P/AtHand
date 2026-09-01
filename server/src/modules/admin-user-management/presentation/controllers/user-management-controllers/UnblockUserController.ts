import {
    NextFunction,
    Request,
    Response
} from "express";

import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";

import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";

import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { USER_MANG_MSG } from "../../constants/USER_MANG_MSG";

export class UnblockUserController {

    constructor(
        private readonly unblockUserUsecase:
            IUsecase<string, void>
    ) {}

    unblockUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params as {id:string}

            await this.unblockUserUsecase.execute(id);

            ResponseHandler.success(
                res,
                HttpStatus.OK,
                USER_MANG_MSG.USER_UNBLOCKED
            );

        } catch (error) {
            next(error);
        }
    };
}