import { Request, Response, NextFunction } from "express";
import { GetUploadUrlUsecase } from "../../application/usecases/GetUploadUrlUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetUploadUrlController {
    constructor(private readonly getUploadUrlUsecase: GetUploadUrlUsecase) { }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { fileName, fileType } = req.body;

            if (!fileName || !fileType) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "fileName and fileType are required");
                return;
            }

            const data = await this.getUploadUrlUsecase.execute(fileName, fileType);
            ResponseHandler.success(res, HttpStatus.CREATED, "Upload URL created successfully", data);
        } catch (error: any) {
            next(error);
        }
    };
}
