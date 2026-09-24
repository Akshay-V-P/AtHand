import { Request, Response, NextFunction } from "express";
import { UpdateProviderServiceUsecase } from "../../application/usecases/UpdateProviderServiceUsecase";
import { UpdateProviderServiceDTO } from "../../application/dtos/ProviderServiceDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class UpdateProviderServiceController {
    constructor(private updateProviderServiceUsecase: UpdateProviderServiceUsecase) { }

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
