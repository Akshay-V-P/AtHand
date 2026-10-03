import { Request, Response, NextFunction } from "express";
import { CreateServiceRequestUseCase } from "../../application/usecases/CreateServiceRequestUseCase";
import { CreateServiceRequestDTO } from "../../application/dtos/ServiceRequestDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class CreateServiceRequestController {
    constructor(private createServiceRequestUseCase: CreateServiceRequestUseCase) { }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Assume authentication middleware sets req.user
            const userId = req.user?.id;
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const dto: CreateServiceRequestDTO = {
                ...req.body,
                userId
            };

            if (!dto.categoryId || !dto.title || !dto.description || !dto.address) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Missing required fields");
                return;
            }

            const serviceRequest = await this.createServiceRequestUseCase.execute(dto);
            ResponseHandler.success(res, HttpStatus.CREATED, "Service request created successfully", serviceRequest);
        } catch (error: any) {
            next(error);
        }
    };
}
