import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { ProviderService } from "../../../../provider-service/domain/entities/ProviderService";
import { BlockProviderServiceDTO } from "../../../application/dtos/ProviderServiceManagementDTO";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";

export class BlockProviderServiceController {
    constructor(
        private readonly blockProviderServiceUsecase: IUsecase<
            BlockProviderServiceDTO,
            ProviderService
        >,
    ) {}

    blockService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID);
                return;
            }

            const { reason } = req.body;
            const service = await this.blockProviderServiceUsecase.execute({ id, reason });

            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.BLOCKED_PROVIDER_SERVICE, service);
        } catch (error) {
            next(error);
        }
    };
}
