import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Provider } from "../../domain/entities/Provider";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { ProviderFilter } from "../../domain/types/ProviderFilter";

export class FetchPublicProvidersUsecase implements IUsecase<ProviderFilter, PaginatedResult<Provider>> {
    constructor(
        private readonly providerRepo: IProviderRepository,
    ) { }

    async execute(data: ProviderFilter): Promise<PaginatedResult<Provider>> {
        const safeData: ProviderFilter = {
            ...data,
            status: ProviderStatus.ACTIVE,
        };

        const providers = await this.providerRepo.findMany(safeData)
        const providersCount = await this.providerRepo.findCount(safeData)

        return {
            items: providers,
            totalItems: providersCount,
            page: data.page,
            limit: data.limit,
            totalPages: Math.ceil(providersCount / data.limit) || 1
        }
    }
}
