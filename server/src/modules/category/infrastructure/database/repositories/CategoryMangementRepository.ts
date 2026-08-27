import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ServiceCategoryResponseDTO } from "../../../../admin-category-management/application/dtos/ServiceCategoryResponseDTO";
import { GetCategoriesDTO } from "../../../application/dtos/GetCategoriesDTO";
import { CategoryStatus } from "../../../domain/enums/CategoryStatus";
import { ICategoryManagementRepository } from "../../../domain/repositories/ICategoryManagementRepository";
import CategoryModel, { CategorySchemaType } from "../models/CategoryModel";

export class CategoryMangementRepository extends BaseRepository<CategorySchemaType> implements ICategoryManagementRepository{

    constructor() {
        super(CategoryModel)
    }

    async findAllAdminManage(options: GetCategoriesDTO): Promise<PaginatedResult<ServiceCategoryResponseDTO>> {
        const {
            page,
            limit,
            search,
            status
        } = options;

        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = {};
        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        
        const [documents, totalItems] = await Promise.all([
                this.model
                    .find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),

                this.model.countDocuments(filter)
        ]);
        console.log(documents)
        return {
            items: documents.map(doc => ({
                id: doc.id,
                name: doc.name,
                description: doc.description ?? undefined,
                commissionPercentage: doc.commissionPercentage,
                slug: doc.slug ?? undefined,
                icon: doc.icon ?? undefined,
                status: doc.status as CategoryStatus,
                subCategoryCount: 0,
                activeProvidersCount: 0
            })),
            totalItems,
            page,
            limit,
            totalPages:Math.ceil(totalItems/limit)
        }
    }
}