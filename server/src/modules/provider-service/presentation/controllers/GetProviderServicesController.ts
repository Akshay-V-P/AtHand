import { Request, Response, NextFunction } from "express";
import { GetProviderServicesUsecase } from "../../application/usecases/GetProviderServicesUsecase";
import { GetProviderServicesDTO } from "../../application/dtos/ProviderServiceDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetProviderServicesController {
    constructor(private getProviderServicesUsecase: GetProviderServicesUsecase) { }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const options: GetProviderServicesDTO = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                search: req.query.search as string | undefined,
                categoryId: req.query.categoryId as string | undefined,
                providerId: req.query.providerId as string | undefined,
                status: req.query.status as string | undefined,
            };
            const result = await this.getProviderServicesUsecase.execute(options);
            ResponseHandler.success(res, HttpStatus.OK, "Provider services retrieved successfully", result);
        } catch (error: any) {
            next(error);
        }
    };
}
