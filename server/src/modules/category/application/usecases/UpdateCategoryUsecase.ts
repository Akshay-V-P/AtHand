import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { UpdateCategoryDTO } from "../dtos/UpdateCategoryDTO";

export class UpdateCategory implements IUsecase<UpdateCategoryDTO, Category> {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(data: UpdateCategoryDTO): Promise<Category> {

        const existingCategory =
            await this.categoryRepository.findById(data.id);

        if (!existingCategory) {
            throw new Error("Category not found");
        }

        const categoryWithSlug =
            await this.categoryRepository.findBySlug(data.slug);

        if (
            categoryWithSlug &&
            categoryWithSlug.id !== data.id
        ) {
            throw new Error("Category with this slug already exists");
        }

        const updatedCategory = new Category(
            data.name,
            data.description,
            data.commissionPercentage,
            data.slug,
            data.icon,
            existingCategory.status,
            data.id
        );

        const category =
            await this.categoryRepository.update(updatedCategory);

        if (!category) {
            throw new Error("Failed to update category");
        }

        return category;
    }
}