import { Request, Response, NextFunction } from "express";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Provider } from "../../domain/entities/Provider";
import { ProviderFilter } from "../../domain/types/ProviderFilter";

export class FetchPublicProvidersController {
    constructor(
        private readonly fetchPublicProvidersUsecase: IUsecase<ProviderFilter, PaginatedResult<Provider>>,
    ) { }

    readonly handler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || "";
            const categoryId = req.query.categoryId as string || undefined;
            const minRating = parseFloat(req.query.minRating as string) || undefined;
            const sort = req.query.sort as string || undefined;
            const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

            const lat = parseFloat(req.query.lat as string);
            const lng = parseFloat(req.query.lng as string);
            const radiusKm = parseFloat(req.query.radius as string) || 10; // Default 10km search

            let location: any = undefined;
            if (!isNaN(lat) && !isNaN(lng)) {
                location = {
                    latitude: lat,
                    longitude: lng,
                    radiusKm
                };
            }

            const filter: ProviderFilter = {
                page,
                limit,
                search,
                categoryId,
                minRating,
                sort,
                sortOrder,
                location
            };

            const data = await this.fetchPublicProvidersUsecase.execute(filter);

            res.status(200).json({ success: true, message: "Providers fetched successfully", data });
        } catch (error: any) {
            console.error("Fetch Public Providers Error:", error);
            res.status(500).json({ success: false, message: error.message, error });
        }
    }
}
