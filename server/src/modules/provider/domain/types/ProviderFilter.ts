import { ProviderStatus } from "../enums/ProviderStatus";

export interface ProviderFilter {
    status?: ProviderStatus;
    categoryId?: string;
    minRating?: number;
    page: number;
    limit: number;

    location?: {
        latitude: number;
        longitude: number;
        radiusKm: number;
    };
}