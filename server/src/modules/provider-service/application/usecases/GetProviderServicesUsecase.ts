import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { ProviderService } from "../../domain/entities/ProviderService";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { GetProviderServicesDTO } from "../dtos/ProviderServiceDTOs";

export class GetProviderServicesUsecase {
    constructor(private providerServiceRepository: IProviderServiceRepository) { }

    async execute(options: GetProviderServicesDTO): Promise<PaginatedResult<ProviderService>> {
        return this.providerServiceRepository.findAll(options);
    }
}
