import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../application/interfaces/IUsecase";
import { CreateProviderDto } from "../../../application/dtos/CreateProviderDto";
import { Provider } from "../../../domain/entities/Provider";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class CreateProviderController {
    constructor(
        private readonly createProviderUsecase: IUsecase<CreateProviderDto, Provider>,
    ) { }
    
    createProvider = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const data: CreateProviderDto = req.body
    
            await this.createProviderUsecase.execute(data)
            ResponseHandler.success(res, HttpStatus.CREATED, PROV_APP_MESSAGES.APPLICATION_SUCCESS)

        } catch (error) {
            next(error)
        }
    }
}