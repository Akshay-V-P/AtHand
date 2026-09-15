import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class GetActiveCategoriesDropdownUsecase implements IUsecase<void, { id: string, name: string }[]> {
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(): Promise<{ id: string, name: string }[]> {
        return this.categoryRepository.findActiveForDropdown();
    }
}
