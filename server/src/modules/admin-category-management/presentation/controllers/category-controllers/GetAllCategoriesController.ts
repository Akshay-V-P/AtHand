import { NextFunction, Request, Response } from "express";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { GetCategoriesDTO } from "../../../../category/application/dtos/GetCategoriesDTO";
import { ServiceCategoryResponseDTO } from "../../../application/dtos/ServiceCategoryResponseDTO";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { CATEGORY_RESPONSE } from "../../constants/CATEGORY_RESPONSE";
import { CategoryStatus } from "../../../../category/domain/enums/CategoryStatus";

export class GetAllCategoriesController{
    constructor(
        private readonly getAllCategoriesUsecase:IUsecase<GetCategoriesDTO, PaginatedResult<ServiceCategoryResponseDTO>>
    ) { }
    
    handle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inputData:GetCategoriesDTO = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search? String(req.query.search) : undefined,
                status:req.query.status? String(req.query.status) as CategoryStatus : undefined ,
            }
            const responseData = await this.getAllCategoriesUsecase.execute(inputData)
            ResponseHandler.success(res, HttpStatus.OK, CATEGORY_RESPONSE.FETCHED_CATEGORIES, responseData)
        } catch (error) {
            next(error)
        }
    }
}