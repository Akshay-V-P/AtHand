import mongoose from "mongoose";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { ProviderService } from "../../../provider-service/domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";
import { AdminUpdateProviderServiceDTO } from "../dtos/ProviderServiceManagementDTO";

export class AdminUpdateProviderServiceUsecase
    implements IUsecase<AdminUpdateProviderServiceDTO, ProviderService> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(dto: AdminUpdateProviderServiceDTO): Promise<ProviderService> {
        if (!dto.id || !mongoose.Types.ObjectId.isValid(dto.id)) {
            throw new BadRequestError("Invalid provider service ID");
        }

        const existingService = await this.providerServiceRepository.findById(dto.id);
        if (!existingService) {
            throw new NotFoundError("Provider service not found");
        }

        if (dto.categoryId !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(dto.categoryId)) {
                throw new BadRequestError("Invalid category ID");
            }
            const category = await this.categoryRepository.findById(dto.categoryId);
            if (!category) {
                throw new NotFoundError("Category not found");
            }
        }

        if (existingService.status === ProviderServiceStatus.BLOCKED && dto.status !== undefined) {
            throw new BadRequestError("Unblock the service before changing its status");
        }

        const nextStatus = existingService.status === ProviderServiceStatus.BLOCKED
            ? ProviderServiceStatus.BLOCKED
            : (dto.status ?? existingService.status);

        const updatedEntity = new ProviderService(
            existingService.providerId,
            dto.categoryId ?? existingService.categoryId,
            dto.name ?? existingService.name,
            dto.description !== undefined ? dto.description : existingService.description,
            dto.media !== undefined ? dto.media : existingService.media,
            dto.onSite !== undefined ? dto.onSite : existingService.onSite,
            dto.acceptUrgent !== undefined ? dto.acceptUrgent : existingService.acceptUrgent,
            dto.instantBooking !== undefined ? dto.instantBooking : existingService.instantBooking,
            dto.serviceRadius !== undefined ? dto.serviceRadius : existingService.serviceRadius,
            dto.startingPrice !== undefined ? dto.startingPrice : existingService.startingPrice,
            dto.pricingType ?? existingService.pricingType,
            dto.isAvailable !== undefined ? dto.isAvailable : existingService.isAvailable,
            nextStatus,
            existingService.id,
            existingService.blockReason,
        );

        const updatedService = await this.providerServiceRepository.update(updatedEntity);
        if (!updatedService) {
            throw new NotFoundError("Provider service not found");
        }

        return updatedService;
    }
}
