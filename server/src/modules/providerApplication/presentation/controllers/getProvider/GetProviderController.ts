import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { GetProviderDto } from "../../../../provider/application/dtos/GetProviderDto";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";
import { Provider } from "../../../../provider/domain/entities/Provider";

export class GetProviderController{
    constructor(
        private readonly getProviderUsecase:IUsecase<GetProviderDto, Provider>,
    ) { }
    
    getProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params as {id:string}
            const responseData = await this.getProviderUsecase.execute({id})
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.GET_PROVIDER, responseData)
        } catch (error) {
            next(error)
        }
    }
}