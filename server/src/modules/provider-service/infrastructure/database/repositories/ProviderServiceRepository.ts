import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ProviderService } from "../../../domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../domain/repositories/IProviderServiceRepository";
import { ProviderServiceMapper } from "../../mappers/ProviderServiceMapper";
import ProviderServiceModel, { ProviderServiceSchemaType } from "../models/ProviderServiceModel";

export class ProviderServiceRepository extends BaseRepository<ProviderServiceSchemaType> implements IProviderServiceRepository {
    constructor() {
        super(ProviderServiceModel);
    }

    async create(service: ProviderService): Promise<ProviderService> {
        const document = await this.createDocument({
            providerId: service.providerId as any,
            categoryId: service.categoryId as any,
            name: service.name,
            description: service.description,
            media: service.media,
            onSite: service.onSite,
            acceptUrgent: service.acceptUrgent,
            instantBooking: service.instantBooking,
            serviceRadius: service.serviceRadius,
            startingPrice: service.startingPrice,
            pricingType: service.pricingType,
            isAvailable: service.isAvailable,
            status: service.status
        });
        return ProviderServiceMapper.toDomain(document);
    }

    async findById(id: string): Promise<ProviderService | null> {
        const document = await this.findDocumentById(id);
        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }

    async findByProviderId(providerId: string, page: number, limit: number): Promise<PaginatedResult<ProviderService>> {
        const skip = (page - 1) * limit;
        const [documents, totalItems] = await Promise.all([
            this.model.find({ providerId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.model.countDocuments({ providerId })
        ]);

        return {
            items: documents.map(doc => ProviderServiceMapper.toDomain(doc)),
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit)
        };
    }

    async findAll(options: any): Promise<PaginatedResult<ProviderService>> {
        const { page = 1, limit = 10, search, categoryId, providerId, status } = options;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (status) filter.status = status;
        if (categoryId) filter.categoryId = categoryId;
        if (providerId) filter.providerId = providerId;
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const [documents, totalItems] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.model.countDocuments(filter)
        ]);

        return {
            items: documents.map(doc => ProviderServiceMapper.toDomain(doc)),
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit)
        };
    }

    async update(service: ProviderService): Promise<ProviderService | null> {
        if (!service.id) throw new Error("Service ID is required");

        const document = await this.updateDocument(service.id, {
            categoryId: service.categoryId as any,
            name: service.name,
            description: service.description,
            media: service.media,
            onSite: service.onSite,
            acceptUrgent: service.acceptUrgent,
            instantBooking: service.instantBooking,
            serviceRadius: service.serviceRadius,
            startingPrice: service.startingPrice,
            pricingType: service.pricingType,
            isAvailable: service.isAvailable
        });

        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }

    async updateStatus(id: string, status: ProviderServiceStatus): Promise<ProviderService | null> {
        const document = await this.updateDocument(id, { status });
        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }
}
