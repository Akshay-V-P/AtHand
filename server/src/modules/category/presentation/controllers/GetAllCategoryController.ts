import { Request, Response, NextFunction } from "express";
import { GetActiveCategoriesDropdownUsecase } from "../../application/usecases/GetActiveCategoriesDropdownUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetAllCategoryController {
    constructor(
        private readonly getActiveCategoriesDropdownUsecase: GetActiveCategoriesDropdownUsecase
    ) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories = await this.getActiveCategoriesDropdownUsecase.execute();
            ResponseHandler.success(res, HttpStatus.OK, "Active categories retrieved successfully", categories);
        } catch (error) {
            next(error);
        }
    }
}
