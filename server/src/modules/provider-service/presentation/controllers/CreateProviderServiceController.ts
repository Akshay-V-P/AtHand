import { Request, Response, NextFunction } from "express";
import { CreateProviderServiceUsecase } from "../../application/usecases/CreateProviderServiceUsecase";
import { CreateProviderServiceDTO } from "../../application/dtos/ProviderServiceDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class CreateProviderServiceController {
    constructor(private createProviderServiceUsecase: CreateProviderServiceUsecase) { }

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
}
