import { NextFunction, Request, Response } from "express";
import { DocumentUploadDTO } from "../../../application/dtos/DocumentUploadDto";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";
import { DocumentType } from "../../../domain/entities/ProviderDocument";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";

export class UploadDocumentController{
    constructor(
        private readonly uploadDocumentUsecase:IUsecase<DocumentUploadDTO, void>
    ) { }
    
    upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: DocumentUploadDTO = req.body
            await this.uploadDocumentUsecase.execute(data)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.DOCUMENT_UPLOADED)
        } catch (error) {
            next(error)
        }
    }
}