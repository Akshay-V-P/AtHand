import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Category } from "../../domain/entities/Category";
import { CategoryStatus } from "../../domain/enums/CategoryStatus";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CreateCategoryDTO } from "../dtos/CreateCategoryDTO";

export class CreateCategoryUsecase implements IUsecase<CreateCategoryDTO, Category> {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(data: CreateCategoryDTO): Promise<Category> {

        const existingCategory =
            await this.categoryRepository.findBySlug(data.slug);

        if (existingCategory) {
            throw new Error("Category with this slug already exists");
        }

        const category = new Category(
            data.name,
            data.description,
            data.commissionPercentage,
            data.slug,
            data.icon,
            CategoryStatus.ACTIVE
        );

        return await this.categoryRepository.create(category);
    }
}