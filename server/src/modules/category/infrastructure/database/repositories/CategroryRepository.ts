

import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { GetCategoriesDTO } from "../../../application/dtos/GetCategoriesDTO";
import { Category } from "../../../domain/entities/Category";
import { CategoryStatus } from "../../../domain/enums/CategoryStatus";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryMapper } from "../mappers/CategoryMapper";
import CategoryModel, {
    CategorySchemaType
} from "../models/CategoryModel";


export class CategoryRepository
    extends BaseRepository<CategorySchemaType>
    implements ICategoryRepository {

    constructor() {
        super(CategoryModel);
    }

    async create(category: Category): Promise<Category> {

        const document = await this.createDocument({
            name: category.name,
            description: category.description,
            commissionPercentage: category.commissionPercentage,
            slug: category.slug,
            icon: category.icon,
            status: category.status
        });

        return CategoryMapper.toDomain(document);
    }

    async findById(id: string): Promise<Category | null> {

        const document = await this.findDocumentById(id);

        if (!document) {
            return null;
        }

        return CategoryMapper.toDomain(document);
    }

    async findBySlug(slug: string): Promise<Category | null> {

        const document = await this.model.findOne({ slug });

        if (!document) {
            return null;
        }

        return CategoryMapper.toDomain(document);
    }


    async findAll(options: GetCategoriesDTO): Promise<PaginatedResult<Category>> {

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

        return {
            items: documents.map(
                document => CategoryMapper.toDomain(document)
            ),
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(
                totalItems / limit
            )
        };
    }

    async update(category: Category): Promise<Category | null> {

        if (!category.id) {
            throw new Error("Category ID is required");
        }

        const document =
            await this.updateDocument(
                category.id,
                {
                    name: category.name,
                    description: category.description,
                    commissionPercentage:
                        category.commissionPercentage,
                    slug: category.slug,
                    icon: category.icon
                }
            );

        if (!document) {
            return null;
        }

        return CategoryMapper.toDomain(document);
    }

    async updateStatus(id: string, status: CategoryStatus): Promise<Category | null> {

        const document =
            await this.updateDocument(
                id,
                { status }
            );

        if (!document) {
            return null;
        }

        return CategoryMapper.toDomain(document);
    }

    
}