import mongoose from "mongoose";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ProviderService } from "../../../provider-service/domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";

export class UnblockProviderServiceUsecase implements IUsecase<string, ProviderService> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
    ) {}

    async execute(id: string): Promise<ProviderService> {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid provider service ID");
        }

        const service = await this.providerServiceRepository.findById(id);
        if (!service) {
            throw new NotFoundError("Provider service not found");
        }

        if (service.status !== ProviderServiceStatus.BLOCKED) {
            throw new BadRequestError("Provider service is not blocked");
        }

        const updatedService = await this.providerServiceRepository.updateStatus(
            id,
            ProviderServiceStatus.ACTIVE,
            null
        );

        if (!updatedService) {
            throw new NotFoundError("Provider service not found");
        }

        return updatedService;
    }
}
