import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { CategoryStatus } from "../../domain/enums/CategoryStatus";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";

export class UnblockCategoryUsecase implements IUsecase<string,void> {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(id: string): Promise<void> {

        const category =
            await this.categoryRepository.findById(id);

        if (!category) {
            throw new Error("Category not found");
        }

        if (category.status === CategoryStatus.ACTIVE) {
            throw new Error("Category is already active");
        }

        const updatedCategory =
            await this.categoryRepository.updateStatus(
                id,
                CategoryStatus.ACTIVE
            );

        if (!updatedCategory) {
            throw new Error("Failed to unblock category");
        }
    }
}