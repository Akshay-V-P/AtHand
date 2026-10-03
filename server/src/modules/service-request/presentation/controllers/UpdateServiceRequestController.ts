import { Request, Response, NextFunction } from "express";
import { UpdateServiceRequestUseCase } from "../../application/usecases/UpdateServiceRequestUseCase";
import { UpdateServiceRequestDTO } from "../../application/dtos/ServiceRequestDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class UpdateServiceRequestController {
    constructor(private updateServiceRequestUseCase: UpdateServiceRequestUseCase) { }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const dto: UpdateServiceRequestDTO = {
                ...req.body,
                id: req.params.id
            };

            const serviceRequest = await this.updateServiceRequestUseCase.execute(dto, userId);
            ResponseHandler.success(res, HttpStatus.OK, "Service request updated successfully", serviceRequest);
        } catch (error: any) {
            next(error);
        }
    };
}
