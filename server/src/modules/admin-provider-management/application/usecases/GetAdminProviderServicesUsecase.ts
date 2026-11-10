import mongoose from "mongoose";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";
import {
    AdminProviderServicesResponseDTO,
    GetAdminProviderServicesDTO,
} from "../dtos/ProviderServiceManagementDTO";

export class GetAdminProviderServicesUsecase
    implements IUsecase<GetAdminProviderServicesDTO, AdminProviderServicesResponseDTO> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly providerServiceRepository: IProviderServiceRepository,
    ) {}

    async execute(data: GetAdminProviderServicesDTO): Promise<AdminProviderServicesResponseDTO> {
        if (!data.providerId || !mongoose.Types.ObjectId.isValid(data.providerId)) {
            throw new BadRequestError("Invalid provider ID");
        }

        let provider = await this.providerRepository.findById(data.providerId);
        if (!provider) {
            provider = await this.providerRepository.findByUserId(data.providerId);
        }
        if (!provider || !provider.id) {
            throw new NotFoundError("Provider not found");
        }

        const canonicalProviderId = provider.id;

        const [servicesResult, stats] = await Promise.all([
            this.providerServiceRepository.findAll({
                page: data.page,
                limit: data.limit,
                search: data.search,
                categoryId: data.categoryId,
                status: data.status,
                providerId: canonicalProviderId,
            }),
            this.providerServiceRepository.getStatsByProviderId(canonicalProviderId),
        ]);

        return {
            ...servicesResult,
            stats,
        };
    }
}
