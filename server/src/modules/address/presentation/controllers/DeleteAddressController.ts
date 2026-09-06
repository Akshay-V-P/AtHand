import { Request, Response, NextFunction } from "express";
import { DeleteAddressUsecase } from "../../application/usecases/DeleteAddressUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class DeleteAddressController {
    constructor(private readonly deleteAddressUsecase: DeleteAddressUsecase) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.body.userId || (req.query.userId as string);
            const { id } = req.params;

            await this.deleteAddressUsecase.execute(id as string, userId as string);

            ResponseHandler.success(res, HttpStatus.OK, "Address deleted successfully");
        } catch (error) {
            next(error);
        }
    }
}
