import { Request, Response, NextFunction } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { UpdateCategoryDTO } from "../../../../category/application/dtos/UpdateCategoryDTO";
import { Category } from "../../../../category/domain/entities/Category";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { CATEGORY_RESPONSE } from "../../constants/CATEGORY_RESPONSE";

export class UpdateCategoryController {

    constructor(
        private readonly updateCategoryUsecase: IUsecase<UpdateCategoryDTO, Category>
    ) {}

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

        try {

            const { id } = req.params;

            const category =
                await this.updateCategoryUsecase.execute({
                    id,
                    ...req.body
                });

            
            ResponseHandler.success(res, HttpStatus.OK, CATEGORY_RESPONSE.CATEGORY_UPDATED, category)
    

        } catch (error) {
            next(error);
        }
    }
}