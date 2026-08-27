import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { GetCategoriesDTO } from "../dtos/GetCategoriesDTO";
import { CategoryResponseDTO } from "../dtos/CategoryResponseDTO";
import { CategoryMapper } from "../mappers/CategoryMapper";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";

export class GetAllCategoriesUsecase implements IUsecase<GetCategoriesDTO, PaginatedResult<CategoryResponseDTO>> {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(
        data: GetCategoriesDTO
    ): Promise<PaginatedResult<CategoryResponseDTO>> {

        const result =
            await this.categoryRepository.findAll(data);

        return {
            ...result,
            items: result.items.map(CategoryMapper.toDTO)
        };
    }
}