import { NextFunction, Request, Response } from "express";
import { BusinessDetailsDraftDto } from "../../../application/dtos/BusinessDraftDto";
import { IUsecase } from "../../../application/interfaces/IUsecase";
import { ProviderDraft } from "../../../domain/entities/ProviderDraft";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class UploadDraftController{
    constructor(
        private readonly uploadBusinessDetailsDraftUsecase:IUsecase<BusinessDetailsDraftDto, ProviderDraft | null>,
    ) { }
    
    uploadDraft = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: BusinessDetailsDraftDto = req.body
            const providerDraft = await this.uploadBusinessDetailsDraftUsecase.execute(data)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.DRAFT_UPDATED, providerDraft)
        } catch (error) {
            next(error)
        }
    }
}