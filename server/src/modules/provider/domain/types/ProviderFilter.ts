import { ProviderStatus } from "../enums/ProviderStatus";

export interface ProviderFilter {
    status?: ProviderStatus;
    categoryId?: string;
    minRating?: number;
    search?: string;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
    page: number;
    limit: number;

    location?: {
        latitude: number;
        longitude: number;
        radiusKm: number;
    };
}