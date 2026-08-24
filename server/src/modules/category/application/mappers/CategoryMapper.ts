import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { Category } from "../../domain/entities/Category";
import { CategoryResponseDTO } from "../dtos/CategoryResponseDTO";

export class CategoryMapper {

    static toDTO(category: Category): CategoryResponseDTO {
        if (!category.id) {
            throw new BadRequestError("Category ID is missing");
        }

        return {
            id: category.id,
            name: category.name,
            description: category.description,
            commissionPercentage: category.commissionPercentage,
            slug: category.slug,
            icon: category.icon,
            status: category.status
        };
    }
}