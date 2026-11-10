import mongoose from "mongoose";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ProviderService } from "../../../provider-service/domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";
import { BlockProviderServiceDTO } from "../dtos/ProviderServiceManagementDTO";

export class BlockProviderServiceUsecase
    implements IUsecase<BlockProviderServiceDTO, ProviderService> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
    ) {}

    async execute(dto: BlockProviderServiceDTO): Promise<ProviderService> {
        if (!dto.id || !mongoose.Types.ObjectId.isValid(dto.id)) {
            throw new BadRequestError("Invalid provider service ID");
        }

        const trimmedReason = dto.reason?.trim();
        if (!trimmedReason || trimmedReason.length < 3) {
            throw new BadRequestError("Block reason must be at least 3 characters");
        }

        const service = await this.providerServiceRepository.findById(dto.id);
        if (!service) {
            throw new NotFoundError("Provider service not found");
        }

        if (service.status === ProviderServiceStatus.BLOCKED) {
            throw new BadRequestError("Provider service is already blocked");
        }

        const updatedService = await this.providerServiceRepository.updateStatus(
            dto.id,
            ProviderServiceStatus.BLOCKED,
            trimmedReason
        );

        if (!updatedService) {
            throw new NotFoundError("Provider service not found");
        }

        return updatedService;
    }
}
