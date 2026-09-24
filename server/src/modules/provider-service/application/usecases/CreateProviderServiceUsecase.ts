import { ProviderService } from "../../domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { CreateProviderServiceDTO } from "../dtos/ProviderServiceDTOs";

export class CreateProviderServiceUsecase {
    constructor(private providerServiceRepository: IProviderServiceRepository) { }

    async execute(dto: CreateProviderServiceDTO): Promise<ProviderService> {
        const service = new ProviderService(
            dto.providerId,
            dto.categoryId,
            dto.name,
            dto.description || "",
            dto.media || [],
            dto.onSite || false,
            dto.acceptUrgent || false,
            dto.instantBooking || false,
            dto.serviceRadius || 0,
            dto.startingPrice,
            dto.pricingType,
            dto.isAvailable !== undefined ? dto.isAvailable : true,
            ProviderServiceStatus.ACTIVE
        );

        return this.providerServiceRepository.create(service);
    }
}
