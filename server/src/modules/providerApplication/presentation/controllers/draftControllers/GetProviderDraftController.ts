import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { CreateProviderDto } from "../../../application/dtos/CreateProviderDto";
import { ProviderDraft } from "../../../../provider/domain/entities/ProviderDraft";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class GetProviderDraftController {
    constructor(
        private readonly GetProviderDraftUsecase:IUsecase<CreateProviderDto, ProviderDraft>
    ) { }
    
    getProviderDraft = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, PROV_APP_MESSAGES.PROVIDE_ALL_FIELDS)
                return
            }

            const responseData = await this.GetProviderDraftUsecase.execute(req.body)
            console.log("Provider draft : ", responseData)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.APPLICATION_SUCCESS, responseData)
        } catch (error) {
            next(error)
        }
    }
}