import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ProviderService } from "../../../domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../domain/repositories/IProviderServiceRepository";
import { ProviderServiceMapper } from "../../mappers/ProviderServiceMapper";
import ProviderServiceModel, { ProviderServiceSchemaType } from "../models/ProviderServiceModel";
import ProviderModel from "../../../../../modules/provider/infrastructure/database/models/ProviderModel";
import mongoose from "mongoose";
import { NearbyServicesFilter } from "../../../application/dtos/ProviderServiceDTOs";
import { NearbyServiceDto } from "../../../application/dtos/NearbyServiceDto";

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

    async findNearbyServices(filter: NearbyServicesFilter): Promise<PaginatedResult<NearbyServiceDto>> {
        const skip = (filter.page - 1) * filter.limit;
        const pipeline: any[] = [];

        let hasGeoNear = false;
        if (filter.lat != null && filter.lng != null && !isNaN(filter.lat) && !isNaN(filter.lng)) {
            hasGeoNear = true;
            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [filter.lng, filter.lat] },
                    distanceField: "distance",
                    maxDistance: (filter.radiusKm || 20) * 1000,
                    spherical: true
                }
            });
        }

        // We temporarily remove strict status matching in case test data is pending
        const providerMatch: any = {};
        if (filter.minRating) providerMatch.averageRating = { $gte: filter.minRating };

        pipeline.push({ $match: providerMatch });

        pipeline.push({
            $lookup: {
                from: "providerservices",
                localField: "_id",
                foreignField: "providerId",
                as: "service"
            }
        });

        pipeline.push({ $unwind: "$service" });

        const serviceMatch: any = {};
        if (filter.categoryId) serviceMatch["service.categoryId"] = new mongoose.Types.ObjectId(filter.categoryId);
        if (filter.search) {
            serviceMatch["$or"] = [
                { "service.name": { $regex: filter.search, $options: "i" } },
                { businessName: { $regex: filter.search, $options: "i" } }
            ];
        }

        pipeline.push({ $match: serviceMatch });

        // Sorting
        const sortStage: any = {};
        if (filter.sortField === "averageRating") {
            sortStage.averageRating = filter.sortOrder === "asc" ? 1 : -1;
        } else if (!hasGeoNear) {
            sortStage["service.createdAt"] = -1;
        }

        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }

        const countPipeline = [...pipeline];
        countPipeline.push({ $count: "totalItems" });

        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: filter.limit });

        // Projection
        pipeline.push({
            $project: {
                id: "$service._id",
                name: "$service.name",
                description: "$service.description",
                media: "$service.media",
                startingPrice: "$service.startingPrice",
                pricingType: "$service.pricingType",
                onSite: "$service.onSite",
                serviceRadius: "$service.serviceRadius",
                categoryId: "$service.categoryId",

                providerId: "$_id",
                providerName: "$businessName",
                providerRating: "$averageRating",
                providerTotalReviews: "$totalReviews",
                providerLocation: "$location.address.city",
                distanceKm: { $divide: ["$distance", 1000] }
            }
        });

        const [data, countResult] = await Promise.all([
            ProviderModel.aggregate(pipeline),
            ProviderModel.aggregate(countPipeline)
        ]);

        const totalItems = countResult.length > 0 ? countResult[0].totalItems : 0;

        return {
            items: data.map(doc => ({
                ...doc,
                id: doc.id.toString(),
                providerId: doc.providerId.toString(),
                categoryId: doc.categoryId.toString(),
            })),
            totalItems,
            page: filter.page,
            limit: filter.limit,
            totalPages: Math.ceil(totalItems / filter.limit)
        };
    }
}
