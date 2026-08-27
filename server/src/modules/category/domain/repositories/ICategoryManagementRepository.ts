import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { ServiceCategoryResponseDTO } from "../../../admin-category-management/application/dtos/ServiceCategoryResponseDTO";
import { GetCategoriesDTO } from "../../application/dtos/GetCategoriesDTO";

export interface ICategoryManagementRepository{
    findAllAdminManage(options:GetCategoriesDTO):Promise<PaginatedResult<ServiceCategoryResponseDTO>>
}