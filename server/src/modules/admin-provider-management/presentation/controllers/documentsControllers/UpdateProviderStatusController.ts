import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { UpdateProviderDto } from "../../../../provider/application/dtos/UpdateProviderDto";
import { Provider } from "../../../../provider/domain/entities/Provider";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";
import { UpdateProviderStatusDTO } from "../../../application/dtos/UpdateProviderStatusDTO";

export class UpdateProviderStatusController {
    constructor(
        private readonly updateProviderStatusUsecase: IUsecase<UpdateProviderStatusDTO, Provider>,
    ) { }
    
    updateProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string
            const {status} = req.body;

            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID)
                return
            }

            
            const provider = await this.updateProviderStatusUsecase.execute({
                id,
                status,
            });

            return ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.UPDATED_PROVIDER, provider);
        } catch (error) {
            next(error);
        }
    }
}