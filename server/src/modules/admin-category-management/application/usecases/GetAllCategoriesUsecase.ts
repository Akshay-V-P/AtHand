import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { GetCategoriesDTO } from "../../../category/application/dtos/GetCategoriesDTO";
import { ICategoryManagementRepository } from "../../../category/domain/repositories/ICategoryManagementRepository";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { ServiceCategoryResponseDTO } from "../dtos/ServiceCategoryResponseDTO";

export class GetAllCategoriesUsecase implements IUsecase<GetCategoriesDTO, PaginatedResult<ServiceCategoryResponseDTO>>{
    constructor(
        private readonly categoryRepository:ICategoryManagementRepository,
    ) { }
    
    async execute(data: GetCategoriesDTO): Promise<PaginatedResult<ServiceCategoryResponseDTO>> {
        return this.categoryRepository.findAllAdminManage(data)
    }
}