import { NextFunction, Request, Response } from "express";
import { CreateProviderDto } from "../../../application/dtos/CreateProviderDto";
import { Provider } from "../../../domain/entities/Provider";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { CreateProviderResponseDto } from "../../../application/dtos/CreateProviderResponseDto";

export class CreateProviderController {
    constructor(
        private readonly createProviderUsecase: IUsecase<CreateProviderDto, CreateProviderResponseDto>,
    ) { }
    
    createProvider = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const data: CreateProviderDto = req.body
    
            const responseData = await this.createProviderUsecase.execute(data)
            ResponseHandler.success(res, HttpStatus.CREATED, PROV_APP_MESSAGES.APPLICATION_SUCCESS, responseData)

        } catch (error) {
            next(error)
        }
    }
}