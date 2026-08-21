import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { Provider } from "../../../../provider/domain/entities/Provider";
import { ProviderFilter } from "../../../../provider/domain/types/ProviderFilter";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";

export class FetchProvidersController{
    constructor(
        private readonly fetchProvidersUsecase:IUsecase<ProviderFilter, PaginatedResult<Provider>>,
    ) { }
    
    fetchProviders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query
            const page = Number(query.page) || 1
            const limit = Number(query.limit) <= 10 ? Number(query.limit) : 10;
            

            const providers = await this.fetchProvidersUsecase.execute({...query ,page, limit})
            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.FETCHED_PROVIDER, providers)
        } catch (error) {
            next(error)
        }
    }
}