import { Request, Response, NextFunction } from "express";
import { CreateCategoryUsecase } from "../../../../category/application/usecases/CreateCategoryUsecase";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { CreateCategoryDTO } from "../../../../category/application/dtos/CreateCategoryDTO";
import { Category } from "../../../../category/domain/entities/Category";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { CATEGORY_RESPONSE } from "../../constants/CATEGORY_RESPONSE";

export class CreateCategoryController {

    constructor(
        private readonly createCategoryUsecase: IUsecase<CreateCategoryDTO, Category>,
    ) {}

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try {

            
            const category = await this.createCategoryUsecase.execute(req.body);

            ResponseHandler.success(res, HttpStatus.OK, CATEGORY_RESPONSE.CREATE_CATEGORY, category)
        

        } catch (error) {
            next(error);
        }
    }
}