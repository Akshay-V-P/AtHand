import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { CreateFileUploadUrlDto } from "../../../application/dtos/CreateFileUploadUrlDto";
import { CreateUploadUrlResponse } from "../../../domain/services/IUploadUrlService";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class CreateFileUploadUrlController {
    constructor(
        private readonly createFileUploadUrlUsecase:IUsecase<CreateFileUploadUrlDto, CreateUploadUrlResponse>,
    ) { }
    
    createUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fileName, fileType } = req.body
            if (!fileName || !fileType) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, PROV_APP_MESSAGES.PROVIDE_REQUIED_FIELDS)
                return
            }
            const data = await this.createFileUploadUrlUsecase.execute({ fileName, fileType})

            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.FILE_UPLOAD_URL, data)
        } catch (error) {
            next(error)
        }
    }
}