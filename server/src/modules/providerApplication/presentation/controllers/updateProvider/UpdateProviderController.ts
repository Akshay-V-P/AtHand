import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { UpdateProviderDto } from "../../../../provider/application/dtos/UpdateProviderDto";
import { Provider } from "../../../../provider/domain/entities/Provider";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class UpdateProviderController{
    constructor(
        private readonly updateProviderUsecase:IUsecase<UpdateProviderDto, Provider>,
    ) { }
    
    updateProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const provider = await this.updateProviderUsecase.execute(req.body)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.PROVIDER_UPDATED, provider)
        } catch (error) {
            next(error)
        }
    }
}