import { Request, Response, NextFunction } from "express";
import { GetAddressesUsecase } from "../../application/usecases/GetAddressesUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetAddressesController {
    constructor(private readonly getAddressesUsecase: GetAddressesUsecase) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.body.userId || req.params.userId;
            const addresses = await this.getAddressesUsecase.execute(userId);

            ResponseHandler.success(res, HttpStatus.OK, "Addresses fetched successfully", addresses);
        } catch (error) {
            next(error);
        }
    }
}
