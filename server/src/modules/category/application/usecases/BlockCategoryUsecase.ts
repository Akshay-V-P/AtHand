import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { CategoryStatus } from "../../domain/enums/CategoryStatus";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";

export class BlockCategory implements IUsecase<string, void> {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(id: string): Promise<void> {

        const category =
            await this.categoryRepository.findById(id);

        if (!category) {
            throw new Error("Category not found");
        }

        if (category.status === CategoryStatus.BLOCKED) {
            throw new Error("Category is already blocked");
        }

        const updatedCategory =
            await this.categoryRepository.updateStatus(
                id,
                CategoryStatus.BLOCKED
            );

        if (!updatedCategory) {
            throw new Error("Failed to block category");
        }
    }
}