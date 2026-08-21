import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Provider } from "../../../provider/domain/entities/Provider";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { ProviderFilter } from "../../../provider/domain/types/ProviderFilter";
import { FetProviderDTO } from "../dtos/FetchProviderDTO";

export class FetchProvidersUsecase implements IUsecase<ProviderFilter, PaginatedResult<Provider>>{
    constructor(
        private readonly providerRepo:IProviderRepository,
    ) { }
    
    async execute(data: ProviderFilter): Promise<PaginatedResult<Provider>> {
        const providers = await this.providerRepo.findMany(data)
        const providersCount = await this.providerRepo.findCount()
        
        return {
            items: providers,
            totalItems: providersCount,
            page: data.page,
            limit: data.limit,
            totalPages:Math.ceil(providersCount/data.limit)
        }
    }
}