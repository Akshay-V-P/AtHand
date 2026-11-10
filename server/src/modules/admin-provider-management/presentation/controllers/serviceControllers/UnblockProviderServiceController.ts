import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { ProviderService } from "../../../../provider-service/domain/entities/ProviderService";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";

export class UnblockProviderServiceController {
    constructor(
        private readonly unblockProviderServiceUsecase: IUsecase<string, ProviderService>,
    ) {}

    unblockService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID);
                return;
            }

            const service = await this.unblockProviderServiceUsecase.execute(id);

            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.UNBLOCKED_PROVIDER_SERVICE, service);
        } catch (error) {
            next(error);
        }
    };
}
