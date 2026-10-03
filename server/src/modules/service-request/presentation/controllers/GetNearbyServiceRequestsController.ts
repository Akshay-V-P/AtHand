import { Request, Response, NextFunction } from "express";
import { GetNearbyServiceRequestsUseCase } from "../../application/usecases/GetNearbyServiceRequestsUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetNearbyServiceRequestsController {
    constructor(private getNearbyServiceRequestsUseCase: GetNearbyServiceRequestsUseCase) { }

    getNearby = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { lat, lng, radius, categoryId, page, limit } = req.query;

            if (!lat || !lng || !radius || !categoryId) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Missing required query parameters: lat, lng, radius, categoryId");
                return;
            }

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lng as string);
            const radiusInKm = parseFloat(radius as string);

            if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusInKm)) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Invalid numerical parameters");
                return;
            }

            const result = await this.getNearbyServiceRequestsUseCase.execute(
                categoryId as string,
                latitude,
                longitude,
                radiusInKm,
                pageNumber,
                limitNumber
            );

            ResponseHandler.success(res, HttpStatus.OK, "Nearby service requests fetched successfully", result);
        } catch (error: any) {
            next(error);
        }
    };
}
