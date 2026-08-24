import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CategoryResponseDTO } from "../dtos/CategoryResponseDTO";
import { CategoryMapper } from "../mappers/CategoryMapper";

export class GetCategory implements IUsecase<string, CategoryResponseDTO>{

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(id: string): Promise<CategoryResponseDTO> {

        const category =
            await this.categoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        return CategoryMapper.toDTO(category);
    }
}