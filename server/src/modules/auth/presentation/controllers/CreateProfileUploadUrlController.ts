import { NextFunction, Request, Response } from "express"
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase"
import { CreateUploadUrlResponse } from "../../../provider/domain/services/IImageUrlService"
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler"
import { HttpStatus } from "../../../../shared/enums/HttpStatus"
import { CreateProfileUploadUrlDto } from "../../application/usecases/CreateProfileUploadUrlUsecase"

export class CreateProfileUploadUrlController {
    constructor(
        private readonly createUploadUrlUsecase: IUsecase<CreateProfileUploadUrlDto, CreateUploadUrlResponse>,
    ) { }

    createUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fileName, fileType } = req.body
            if (!fileName || !fileType) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "File name and type are required")
                return
            }
            const data = await this.createUploadUrlUsecase.execute({ fileName, fileType })
            ResponseHandler.success(res, HttpStatus.OK, "File upload URL generated successfully", data)
        } catch (error) {
            next(error)
        }
    }
}
