import { Request, Response, NextFunction } from "express";
import { UpdateAddressUsecase } from "../../application/usecases/UpdateAddressUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class UpdateAddressController {
    constructor(private readonly updateAddressUsecase: UpdateAddressUsecase) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.body.userId;
            const { id } = req.params;
            const addressData = { ...req.body, id, userId };

            const updatedAddress = await this.updateAddressUsecase.execute(addressData);

            ResponseHandler.success(res, HttpStatus.OK, "Address updated successfully", updatedAddress);
        } catch (error) {
            next(error);
        }
    }
}
