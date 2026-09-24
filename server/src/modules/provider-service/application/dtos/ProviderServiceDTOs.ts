import { PricingType } from "../../domain/enums/PricingType";

export interface CreateProviderServiceDTO {
    providerId: string;
    categoryId: string;
    name: string;
    description?: string;
    media?: string[];
    onSite?: boolean;
    acceptUrgent?: boolean;
    instantBooking?: boolean;
    serviceRadius?: number;
    startingPrice: number;
    pricingType: PricingType;
    isAvailable?: boolean;
}

export interface UpdateProviderServiceDTO {
    id: string;
    categoryId?: string;
    name?: string;
    description?: string;
    media?: string[];
    onSite?: boolean;
    acceptUrgent?: boolean;
    instantBooking?: boolean;
    serviceRadius?: number;
    startingPrice?: number;
    pricingType?: PricingType;
    isAvailable?: boolean;
}

export interface GetProviderServicesDTO {
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
    providerId?: string;
    status?: string;
}

export interface NearbyServicesFilter {
    page: number;
    limit: number;
    lat?: number | null;
    lng?: number | null;
    radiusKm?: number;
    categoryId?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    minRating?: number;
}
