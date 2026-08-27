import { Request, Response, NextFunction } from "express";
import { GetCategoryUsecase } from "../../../../category/application/usecases/GetCategoryUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { CATEGORY_RESPONSE } from "../../constants/CATEGORY_RESPONSE";

export class GetCategoryController {

    constructor(
        private readonly getCategoryUsecase: GetCategoryUsecase
    ) {}

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try {

            const { id } = req.params as {id:string};

            const category =
                await this.getCategoryUsecase.execute(id);

            ResponseHandler.success(res, HttpStatus.OK, CATEGORY_RESPONSE.CATEGORY, category)
            

        } catch (error) {
            next(error);
        }
    }
}