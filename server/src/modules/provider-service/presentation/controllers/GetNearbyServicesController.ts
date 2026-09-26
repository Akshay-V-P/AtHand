import { Request, Response, NextFunction } from "express";
import { GetNearbyServicesUsecase } from "../../application/usecases/GetNearbyServicesUsecase";
import { NearbyServicesFilter } from "../../application/dtos/ProviderServiceDTOs";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetNearbyServicesController {
    constructor(private getNearbyServicesUsecase: GetNearbyServicesUsecase) { }

    getNearby = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter: NearbyServicesFilter = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                search: req.query.search as string | undefined,
                categoryId: req.query.categoryId as string | undefined,
                lat: parseFloat(req.query.lat as string) || null,
                lng: parseFloat(req.query.lng as string) || null,
                radiusKm: parseFloat(req.query.radius as string) || 15,
                minRating: parseFloat(req.query.minRating as string) || undefined,
                sortField: req.query.sort as string | undefined,
                sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
            };

            const result = await this.getNearbyServicesUsecase.execute(filter);

            console.log("services",result)
            ResponseHandler.success(res, HttpStatus.OK, "Nearby services retrieved successfully", result);
        } catch (error: any) {
            next(error);
        }
    };
}
