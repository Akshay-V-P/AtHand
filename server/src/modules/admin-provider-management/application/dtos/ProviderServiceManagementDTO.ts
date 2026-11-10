import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { ProviderServiceStats } from "../../../provider-service/application/dtos/ProviderServiceDTOs";
import { ProviderService } from "../../../provider-service/domain/entities/ProviderService";
import { PricingType } from "../../../provider-service/domain/enums/PricingType";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";

export interface GetAdminProviderServicesDTO {
    providerId: string;
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
    status?: string;
}

export interface AdminProviderServicesResponseDTO extends PaginatedResult<ProviderService> {
    stats: ProviderServiceStats;
}

export interface AdminUpdateProviderServiceDTO {
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
    status?: ProviderServiceStatus.ACTIVE | ProviderServiceStatus.INACTIVE;
}

export interface BlockProviderServiceDTO {
    id: string;
    reason: string;
}
