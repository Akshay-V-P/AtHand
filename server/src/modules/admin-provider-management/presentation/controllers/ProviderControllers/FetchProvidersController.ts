import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { Provider } from "../../../../provider/domain/entities/Provider";
import { ProviderFilter } from "../../../../provider/domain/types/ProviderFilter";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";

export class FetchProvidersController {
    constructor(
        private readonly fetchProvidersUsecase: IUsecase<ProviderFilter, PaginatedResult<Provider>>,
    ) { }

    fetchProviders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query
            const page = Number(query.page) || 1
            const limit = Number(query.limit) <= 10 ? Number(query.limit) : 10;

            const search = typeof query.search === "string" ? query.search : undefined;
            const status = typeof query.status === "string" ? (query.status as any) : undefined;
            const categoryId = typeof query.categoryId === "string" ? query.categoryId : undefined;
            const sort = typeof query.sort === "string" ? query.sort : undefined;
            const sortOrder = typeof query.sortOrder === "string" && (query.sortOrder === 'asc' || query.sortOrder === 'desc') ? query.sortOrder : undefined;

            const providers = await this.fetchProvidersUsecase.execute({
                ...query,
                page,
                limit,
                search,
                status,
                categoryId,
                sort,
                sortOrder
            })
            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.FETCHED_PROVIDER, providers)
        } catch (error) {
            next(error)
        }
    }
}