import { Request, Response, NextFunction } from "express";
import { CancelServiceRequestUseCase } from "../../application/usecases/CancelServiceRequestUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class CancelServiceRequestController {
    constructor(private cancelServiceRequestUseCase: CancelServiceRequestUseCase) { }

    cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "User not authenticated");
                return;
            }

            const id = req.params.id as string;
            const serviceRequest = await this.cancelServiceRequestUseCase.execute(id, userId);

            ResponseHandler.success(res, HttpStatus.OK, "Service request cancelled successfully", serviceRequest);
        } catch (error: any) {
            next(error);
        }
    };
}
