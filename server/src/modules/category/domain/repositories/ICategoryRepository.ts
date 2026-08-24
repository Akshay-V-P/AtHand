import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { GetCategoriesDTO } from "../../application/dtos/GetCategoriesDTO";
import { Category } from "../entities/Category";
import { CategoryStatus } from "../enums/CategoryStatus";

export interface ICategoryRepository{
    findAll(options:GetCategoriesDTO): Promise<PaginatedResult<Category>>

    create(category: Category): Promise<Category>;

    findById(id: string): Promise<Category | null>;

    findBySlug(slug: string): Promise<Category | null>;

    update(category: Category): Promise<Category | null>;

    updateStatus(
        id: string,
        status: CategoryStatus
    ): Promise<Category | null>;
}
