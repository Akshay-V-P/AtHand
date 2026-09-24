import { ProviderService } from "../../domain/entities/ProviderService";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { UpdateProviderServiceDTO } from "../dtos/ProviderServiceDTOs";

export class UpdateProviderServiceUsecase {
    constructor(private providerServiceRepository: IProviderServiceRepository) { }

    async execute(dto: UpdateProviderServiceDTO): Promise<ProviderService | null> {
        const existingService = await this.providerServiceRepository.findById(dto.id);
        if (!existingService) return null;

        const updatedService = new ProviderService(
            existingService.providerId,
            dto.categoryId || existingService.categoryId,
            dto.name || existingService.name,
            dto.description !== undefined ? dto.description : existingService.description,
            dto.media || existingService.media,
            dto.onSite !== undefined ? dto.onSite : existingService.onSite,
            dto.acceptUrgent !== undefined ? dto.acceptUrgent : existingService.acceptUrgent,
            dto.instantBooking !== undefined ? dto.instantBooking : existingService.instantBooking,
            dto.serviceRadius !== undefined ? dto.serviceRadius : existingService.serviceRadius,
            dto.startingPrice !== undefined ? dto.startingPrice : existingService.startingPrice,
            dto.pricingType || existingService.pricingType,
            dto.isAvailable !== undefined ? dto.isAvailable : existingService.isAvailable,
            existingService.status,
            existingService.id
        );

        return this.providerServiceRepository.update(updatedService);
    }
}
