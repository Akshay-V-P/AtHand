import { Request, Response, NextFunction } from "express";
import { GetServiceRequestUseCase } from "../../application/usecases/GetServiceRequestUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetServiceRequestController {
    constructor(private getServiceRequestUseCase: GetServiceRequestUseCase) { }

    get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const id = req.params.id as string;
            const serviceRequest = await this.getServiceRequestUseCase.execute(id, userId);

            ResponseHandler.success(res, HttpStatus.OK, "Service request retrieved successfully", serviceRequest);
        } catch (error: any) {
            next(error);
        }
    };
}
