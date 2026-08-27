import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { CATEGORY_RESPONSE } from "../../constants/CATEGORY_RESPONSE";

export class BlockCategoryController{
    constructor(
        private readonly blockCategoryUsecase:IUsecase<string, void>
    ) { }
    
    handle = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const { id } = req.params as { id: string }
            if (!id) {
                
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, CATEGORY_RESPONSE.PROVIDE_VALID_ID)
                return
            }
            await this.blockCategoryUsecase.execute(id)
            ResponseHandler.success(res, HttpStatus.OK, CATEGORY_RESPONSE.STATUS_UPDATED)
        } catch (error) {
            next(error)
        }
    }
}