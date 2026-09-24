import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { ProviderService } from "../entities/ProviderService";
import { ProviderServiceStatus } from "../enums/ProviderServiceStatus";
import { NearbyServicesFilter } from "../../application/dtos/ProviderServiceDTOs";
import { NearbyServiceDto } from "../../application/dtos/NearbyServiceDto";

export interface IProviderServiceRepository {
    create(service: ProviderService): Promise<ProviderService>;
    findById(id: string): Promise<ProviderService | null>;
    findByProviderId(providerId: string, page: number, limit: number): Promise<PaginatedResult<ProviderService>>;
    findAll(options: any): Promise<PaginatedResult<ProviderService>>;
    update(service: ProviderService): Promise<ProviderService | null>;
    updateStatus(id: string, status: ProviderServiceStatus): Promise<ProviderService | null>;
    findNearbyServices(filter: NearbyServicesFilter): Promise<PaginatedResult<NearbyServiceDto>>;
}
