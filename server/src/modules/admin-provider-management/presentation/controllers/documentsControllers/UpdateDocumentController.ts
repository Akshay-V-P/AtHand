import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";
import { UpdateDocumentUsecase } from "../../../../provider/application/usecases/UpdateDocumentUsecase";
import { ProviderDocumentUpdateDTO } from "../../../../providerApplication/application/dtos/ProviderDocumentUpdateDTO";

export class UpdateDocumentController {
    constructor(
        private readonly updateDocumentUsecase: UpdateDocumentUsecase
    ) {}

    updateDocument = async (req: Request, res: Response, next:NextFunction) => {
        try {
            const id = req.params.id as string

            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.DOCUMENT_ID_NEEDED)
                return 

            }

            const { 
                documentType, 
                documentKey, 
                remarks, 
                verificationStatus 
            } = req.body;

            

            const updateData: ProviderDocumentUpdateDTO = {
                documentType,
                documentKey,
                remarks,
                verificationStatus
            };

            

            await this.updateDocumentUsecase.execute({
                id,
                updateData
            });

            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.DOCUMENT_UPDATED)

        } catch (error) {
            next(error)
        }
    }
}