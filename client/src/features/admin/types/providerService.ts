export type ProviderServiceStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type PricingType = "HOURLY" | "FLAT_FEE";

export interface IProviderService {
    id: string;
    providerId: string;
    categoryId: string;
    categoryName?: string;
    name: string;
    description: string;
    media: string[];
    onSite: boolean;
    acceptUrgent: boolean;
    instantBooking: boolean;
    serviceRadius: number;
    startingPrice: number;
    pricingType: PricingType;
    isAvailable: boolean;
    status: ProviderServiceStatus;
    blockReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProviderServiceStats {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
    blockedServices: number;
    averagePrice: number;
    maxServiceRadius: number;
    onSiteCount: number;
    instantBookingCount: number;
}

export interface IGetProviderServicesParams {
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
    status?: string;
}

export interface IAdminProviderServicesResponse {
    items: IProviderService[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    stats: IProviderServiceStats;
}

export interface IAdminUpdateProviderServicePayload {
    name?: string;
    categoryId?: string;
    description?: string;
    startingPrice?: number;
    pricingType?: PricingType;
    serviceRadius?: number;
    onSite?: boolean;
    acceptUrgent?: boolean;
    instantBooking?: boolean;
    isAvailable?: boolean;
    status?: "ACTIVE" | "INACTIVE";
    media?: string[];
}
