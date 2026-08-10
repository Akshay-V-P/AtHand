import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { GetProviderDto } from "../../../application/dtos/GetProviderDto";
import { GetProviderResponseDto } from "../../../application/dtos/GetProviderResponseDto";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class GetProviderController{
    constructor(
        private readonly getProviderUsecase:IUsecase<GetProviderDto, GetProviderResponseDto>,
    ) { }
    
    getProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responseData = await this.getProviderUsecase.execute(req.body)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.GET_PROVIDER, responseData)
        } catch (error) {
            next(error)
        }
    }
}