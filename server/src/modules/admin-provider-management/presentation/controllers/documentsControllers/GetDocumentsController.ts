import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { GetDocumentsDto } from "../../../../provider/application/dtos/GetDocumentsDto";
import { ProviderDocument } from "../../../../provider/domain/entities/ProviderDocument";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";

export class GetDoucmentsController{
    constructor(
        private readonly GetDocumentUsecase:IUsecase<GetDocumentsDto, ProviderDocument[] | null>
    ) { }
    
    getDocuments = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const providerId = (req.params.id || req.query.id) as string;

            if (!providerId) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID)
                return
            }

            
            const dto: GetDocumentsDto = {
                id: providerId
            };

            const documents = await this.GetDocumentUsecase.execute(dto);
            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.FETCHED_DOCUMENTS, documents)
        } catch (error) {
            next(error)
        }
    }
}