import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class GetDisplayImageUrlController{
    constructor(
        private readonly getImageDisplayUrlUsecase:IUsecase<string, string|null>,
    ) { }
    
    getDisplayUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.key) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, PROV_APP_MESSAGES.REQUIRE_KEY)
                return
            }

            const url = await this.getImageDisplayUrlUsecase.execute(req.body.key)
            if (!url) {
                ResponseHandler.error(res, HttpStatus.NOT_FOUND, PROV_APP_MESSAGES.INVALID_KEY)
                return
            }
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.DISPLAY_IMAGE, url)
        } catch (error) {
            next(error)
        }
    }
}