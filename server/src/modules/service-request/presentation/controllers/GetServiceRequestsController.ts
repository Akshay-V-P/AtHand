import { Request, Response, NextFunction } from "express";
import { GetUserServiceRequestsUseCase } from "../../application/usecases/GetUserServiceRequestsUseCase";
import { GetServiceRequestsDTO } from "../../application/dtos/ServiceRequestDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";

export class GetServiceRequestsController {
    constructor(private getUserServiceRequestsUseCase: GetUserServiceRequestsUseCase) { }

    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const dto: GetServiceRequestsDTO = {
                userId,
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                status: req.query.status as ServiceRequestStatus
            };

            const result = await this.getUserServiceRequestsUseCase.execute(dto);

            ResponseHandler.success(res, HttpStatus.OK, "Service requests retrieved successfully", result);
        } catch (error: any) {
            next(error);
        }
    };
}
