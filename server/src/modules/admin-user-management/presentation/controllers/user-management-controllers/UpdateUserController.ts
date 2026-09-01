import {NextFunction, Request,Response} from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { UserUpdateDto } from "../../../../auth/application/dto/UserUpdateDto";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { USER_MANG_MSG } from "../../constants/USER_MANG_MSG";

interface UpdateUserInput {
    id: string;
    data: UserUpdateDto;
}

export class UpdateUserController {

    constructor(
        private readonly updateUserUsecase:IUsecase<UpdateUserInput,void>
    ) {}

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const { id } = req.params as {id:string}

            const data: UserUpdateDto =
                req.body;

            await this.updateUserUsecase.execute({
                id,
                data
            });

            ResponseHandler.success(
                res,
                HttpStatus.OK,
                USER_MANG_MSG.USER_UPDATED
            );

        } catch (error) {
            next(error);
        }
    };
}