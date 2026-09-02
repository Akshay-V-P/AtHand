import { NextFunction, Request, Response } from "express";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { GetCategoriesDTO } from "../../../../category/application/dtos/GetCategoriesDTO";
import { CategoryResponseDTO } from "../../../../category/application/dtos/CategoryResponseDTO";
import { CategoryStatus } from "../../../../category/domain/enums/CategoryStatus";
import { PROV_APP_MESSAGES } from "../../constants/responseMessages";

export class GetAllCategoriesController {
    constructor(
        private readonly getAllCategoriesUsecase: IUsecase<GetCategoriesDTO, PaginatedResult<CategoryResponseDTO>>
    ) { }

    getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inputData: GetCategoriesDTO = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search ? String(req.query.search) : undefined,
                status: req.query.status ? String(req.query.status) as CategoryStatus : undefined,
            }

            const responseData = await this.getAllCategoriesUsecase.execute(inputData)
            ResponseHandler.success(res, HttpStatus.OK, PROV_APP_MESSAGES.GET_CATEGORIES, responseData)
        } catch (error) {
            next(error)
        }
    }
}
