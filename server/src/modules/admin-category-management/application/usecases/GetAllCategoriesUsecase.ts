import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { GetCategoriesDTO } from "../../../category/application/dtos/GetCategoriesDTO";
import { ICategoryManagementRepository } from "../../../category/domain/repositories/ICategoryManagementRepository";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";
import { ServiceCategoryResponseDTO } from "../dtos/ServiceCategoryResponseDTO";

export class GetAllCategoriesUsecase implements IUsecase<GetCategoriesDTO, PaginatedResult<ServiceCategoryResponseDTO>>{
    constructor(
        private readonly categoryRepository: ICategoryManagementRepository,
        private readonly providerServiceRepository:IProviderServiceRepository
    ) { }
    
    async execute(data: GetCategoriesDTO): Promise<PaginatedResult<ServiceCategoryResponseDTO>> {
        const categories = await this.categoryRepository.findAllAdminManage(data)
        const updatedCategories = await Promise.all(
            categories.items.map(async (category) => {
                const serviceCount = await this.providerServiceRepository.countServiceByCategoryId(category.id)
                return {
                    ...category,
                    subCategoryCount:serviceCount
                }
            })
        )

        return {
            ...categories,
            items:updatedCategories
        }
    }
}