import { Request, Response, NextFunction } from "express";
import { CreateProviderServiceUsecase } from "../../application/usecases/CreateProviderServiceUsecase";
import { GetProviderServiceUsecase } from "../../application/usecases/GetProviderServiceUsecase";
import { GetProviderServicesUsecase } from "../../application/usecases/GetProviderServicesUsecase";
import { UpdateProviderServiceUsecase } from "../../application/usecases/UpdateProviderServiceUsecase";
import { CreateProviderServiceDTO, UpdateProviderServiceDTO, GetProviderServicesDTO } from "../../application/dtos/ProviderServiceDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class ProviderServiceController {
    constructor(
        private createProviderServiceUsecase: CreateProviderServiceUsecase,
        private getProviderServiceUsecase: GetProviderServiceUsecase,
        private getProviderServicesUsecase: GetProviderServicesUsecase,
        private updateProviderServiceUsecase: UpdateProviderServiceUsecase
    ) { }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: CreateProviderServiceDTO = req.body;
            if (!dto.providerId || !dto.categoryId || !dto.name || dto.startingPrice === undefined || !dto.pricingType) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Missing required fields");
                return;
            }

            const service = await this.createProviderServiceUsecase.execute(dto);
            ResponseHandler.success(res, HttpStatus.CREATED, "Provider service created successfully", service);
        } catch (error: any) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const service = await this.getProviderServiceUsecase.execute(id as string);
            if (!service) {
                ResponseHandler.error(res, HttpStatus.NOT_FOUND, "Service not found");
                return;
            }
            ResponseHandler.success(res, HttpStatus.OK, "Provider service retrieved successfully", service);
        } catch (error: any) {
            next(error);
        }
    };

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

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const dto: UpdateProviderServiceDTO = { id, ...req.body };
            const service = await this.updateProviderServiceUsecase.execute(dto);
            if (!service) {
                ResponseHandler.error(res, HttpStatus.NOT_FOUND, "Service not found");
                return;
            }
            ResponseHandler.success(res, HttpStatus.OK, "Provider service updated successfully", service);
        } catch (error: any) {
            next(error);
        }
    };
}
