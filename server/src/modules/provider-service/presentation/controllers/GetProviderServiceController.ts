import { Request, Response, NextFunction } from "express";
import { GetProviderServiceUsecase } from "../../application/usecases/GetProviderServiceUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetProviderServiceController {
    constructor(private getProviderServiceUsecase: GetProviderServiceUsecase) { }

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
}
