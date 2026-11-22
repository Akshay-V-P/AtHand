import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { PublicProviderProfileDTO } from "../../application/dtos/PublicProviderProfileDTO";
import { GetPublicProviderProfileInput } from "../../application/usecases/GetPublicProviderProfileUsecase";

export class GetPublicProviderProfileController {
    constructor(
        private readonly getPublicProviderProfileUsecase: IUsecase<
            GetPublicProviderProfileInput,
            PublicProviderProfileDTO
        >
    ) {}

    readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.params.id as string;
            const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
            const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

            const result = await this.getPublicProviderProfileUsecase.execute({
                providerId,
                lat: lat !== undefined && !isNaN(lat) ? lat : undefined,
                lng: lng !== undefined && !isNaN(lng) ? lng : undefined,
            });

            ResponseHandler.success(res, HttpStatus.OK, "Provider profile retrieved successfully", result);
        } catch (error) {
            next(error);
        }
    };
}
