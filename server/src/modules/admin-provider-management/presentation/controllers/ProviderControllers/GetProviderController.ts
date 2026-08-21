import { NextFunction, Request, Response } from "express"
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase"
import { GetProviderDto } from "../../../../provider/application/dtos/GetProviderDto"
import { Provider } from "../../../../provider/domain/entities/Provider"
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../../shared/enums/HttpStatus"
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES"

export class GetProviderController{
    constructor(
        private readonly getProviderUsecase:IUsecase<GetProviderDto, Provider>,
    ) { }
    
    getProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params as {id:string}
            const responseData = await this.getProviderUsecase.execute({id})
            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.FOUND_PROVIDER, responseData)
        } catch (error) {
            next(error)
        }
    }
}