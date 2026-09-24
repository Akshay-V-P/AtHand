import { NearbyServicesFilter } from "../dtos/ProviderServiceDTOs";
import { NearbyServiceDto } from "../dtos/NearbyServiceDto";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";

export class GetNearbyServicesUsecase {
    constructor(private readonly providerServiceRepository: IProviderServiceRepository) { }

    async execute(filter: NearbyServicesFilter): Promise<PaginatedResult<NearbyServiceDto>> {
        return await this.providerServiceRepository.findNearbyServices(filter);
    }
}
