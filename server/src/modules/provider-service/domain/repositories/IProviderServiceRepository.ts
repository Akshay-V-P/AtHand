import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { ProviderService } from "../entities/ProviderService";
import { ProviderServiceStatus } from "../enums/ProviderServiceStatus";
import { NearbyServicesFilter, ProviderServiceStats } from "../../application/dtos/ProviderServiceDTOs";
import { NearbyProviderDto } from "../../application/dtos/NearbyServiceDto";

export interface IProviderServiceRepository {
    create(service: ProviderService): Promise<ProviderService>;
    findById(id: string): Promise<ProviderService | null>;
    findByProviderId(providerId: string, page: number, limit: number): Promise<PaginatedResult<ProviderService>>;
    findAll(options: any): Promise<PaginatedResult<ProviderService>>;
    update(service: ProviderService): Promise<ProviderService | null>;
    updateStatus(id: string, status: ProviderServiceStatus, blockReason?: string | null): Promise<ProviderService | null>;
    getStatsByProviderId(providerId: string): Promise<ProviderServiceStats>;
    findNearbyServices(filter: NearbyServicesFilter): Promise<PaginatedResult<NearbyProviderDto>>;
    countServiceByCategoryId(categoryId: string): Promise<number>;
}
