import { Request, Response, NextFunction } from "express";
import { AddAddressUsecase } from "../../application/usecases/AddAddressUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class AddAddressController {
    constructor(private readonly addAddressUsecase: AddAddressUsecase) { }

    handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // we assume that auth middleware attaches the user ID payload to req.user.id
            const userId = req.user?.id || req.body.userId;
            const addressData = { ...req.body, userId };
            const address = await this.addAddressUsecase.execute(addressData);

            ResponseHandler.success(res, HttpStatus.CREATED, "Address added successfully", address);
        } catch (error) {
            next(error);
        }
    }
}
