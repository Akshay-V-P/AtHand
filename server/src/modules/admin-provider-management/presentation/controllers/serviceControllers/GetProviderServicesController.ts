import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import {
    AdminProviderServicesResponseDTO,
    GetAdminProviderServicesDTO,
} from "../../../application/dtos/ProviderServiceManagementDTO";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";

export class GetProviderServicesController {
    constructor(
        private readonly getAdminProviderServicesUsecase: IUsecase<
            GetAdminProviderServicesDTO,
            AdminProviderServicesResponseDTO
        >,
    ) {}

    getServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = req.params.id as string;
            if (!providerId) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID);
                return;
            }

            const rawPage = Number(req.query.page);
            const rawLimit = Number(req.query.limit);
            const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
            const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 50) : 5;

            const search = typeof req.query.search === "string" ? req.query.search : undefined;
            const categoryId = typeof req.query.categoryId === "string" && req.query.categoryId.trim()
                ? req.query.categoryId
                : undefined;
            const status = typeof req.query.status === "string" && req.query.status.trim()
                ? req.query.status
                : undefined;

            const result = await this.getAdminProviderServicesUsecase.execute({
                providerId,
                page,
                limit,
                search,
                categoryId,
                status,
            });

            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.FETCHED_PROVIDER_SERVICES, result);
        } catch (error) {
            next(error);
        }
    };
}
