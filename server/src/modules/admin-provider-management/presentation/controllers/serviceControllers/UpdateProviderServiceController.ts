import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { ProviderService } from "../../../../provider-service/domain/entities/ProviderService";
import { AdminUpdateProviderServiceDTO } from "../../../application/dtos/ProviderServiceManagementDTO";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";

export class UpdateProviderServiceController {
    constructor(
        private readonly adminUpdateProviderServiceUsecase: IUsecase<
            AdminUpdateProviderServiceDTO,
            ProviderService
        >,
    ) {}

    updateService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID);
                return;
            }

            const service = await this.adminUpdateProviderServiceUsecase.execute({
                id,
                ...req.body,
            });

            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.UPDATED_PROVIDER_SERVICE, service);
        } catch (error) {
            next(error);
        }
    };
}
