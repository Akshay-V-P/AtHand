import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ProviderService } from "../../../domain/entities/ProviderService";
import { ProviderServiceStatus } from "../../../domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../domain/repositories/IProviderServiceRepository";
import { ProviderServiceMapper } from "../../mappers/ProviderServiceMapper";
import ProviderServiceModel, { ProviderServiceSchemaType } from "../models/ProviderServiceModel";
import ProviderModel from "../../../../../modules/provider/infrastructure/database/models/ProviderModel";
import mongoose from "mongoose";
import { NearbyServicesFilter, ProviderServiceStats } from "../../../application/dtos/ProviderServiceDTOs";
import { NearbyProviderDto } from "../../../application/dtos/NearbyServiceDto";

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
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const document = await this.model.findById(id).populate("categoryId", "name");
        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }

    async findByProviderId(providerId: string, page: number, limit: number): Promise<PaginatedResult<ProviderService>> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            return { items: [], totalItems: 0, page, limit, totalPages: 0 };
        }
        const skip = (page - 1) * limit;
        const [documents, totalItems] = await Promise.all([
            this.model.find({ providerId }).populate("categoryId", "name").skip(skip).limit(limit).sort({ createdAt: -1 }),
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
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            filter.categoryId = new mongoose.Types.ObjectId(categoryId);
        }
        if (providerId && mongoose.Types.ObjectId.isValid(providerId)) {
            filter.providerId = new mongoose.Types.ObjectId(providerId);
        }
        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const [documents, totalItems] = await Promise.all([
            this.model.find(filter).populate("categoryId", "name").skip(skip).limit(limit).sort({ createdAt: -1 }),
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

        const document = await this.model.findByIdAndUpdate(
            service.id,
            {
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
            },
            { new: true }
        ).populate("categoryId", "name");

        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }

    async updateStatus(id: string, status: ProviderServiceStatus, blockReason?: string | null): Promise<ProviderService | null> {
        const updatePayload: Record<string, any> = {
            status,
            blockReason: status === ProviderServiceStatus.BLOCKED ? (blockReason ?? null) : null
        };
        const document = await this.model
            .findByIdAndUpdate(id, updatePayload, { new: true })
            .populate("categoryId", "name");
        if (!document) return null;
        return ProviderServiceMapper.toDomain(document);
    }

    async getStatsByProviderId(providerId: string): Promise<ProviderServiceStats> {
        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            return {
                totalServices: 0,
                activeServices: 0,
                inactiveServices: 0,
                blockedServices: 0,
                averagePrice: 0,
                maxServiceRadius: 0,
                onSiteCount: 0,
                instantBookingCount: 0,
            };
        }

        const [result] = await this.model.aggregate([
            { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
            {
                $group: {
                    _id: null,
                    totalServices: { $sum: 1 },
                    activeServices: {
                        $sum: { $cond: [{ $eq: ["$status", ProviderServiceStatus.ACTIVE] }, 1, 0] }
                    },
                    inactiveServices: {
                        $sum: { $cond: [{ $eq: ["$status", ProviderServiceStatus.INACTIVE] }, 1, 0] }
                    },
                    blockedServices: {
                        $sum: { $cond: [{ $eq: ["$status", ProviderServiceStatus.BLOCKED] }, 1, 0] }
                    },
                    averagePrice: { $avg: "$startingPrice" },
                    maxServiceRadius: { $max: "$serviceRadius" },
                    onSiteCount: { $sum: { $cond: ["$onSite", 1, 0] } },
                    instantBookingCount: { $sum: { $cond: ["$instantBooking", 1, 0] } }
                }
            }
        ]);

        if (!result) {
            return {
                totalServices: 0,
                activeServices: 0,
                inactiveServices: 0,
                blockedServices: 0,
                averagePrice: 0,
                maxServiceRadius: 0,
                onSiteCount: 0,
                instantBookingCount: 0,
            };
        }

        return {
            totalServices: result.totalServices || 0,
            activeServices: result.activeServices || 0,
            inactiveServices: result.inactiveServices || 0,
            blockedServices: result.blockedServices || 0,
            averagePrice: Number((result.averagePrice || 0).toFixed(2)),
            maxServiceRadius: result.maxServiceRadius || 0,
            onSiteCount: result.onSiteCount || 0,
            instantBookingCount: result.instantBookingCount || 0,
        };
    }

    async countServiceByCategoryId(categoryId: string): Promise<number> {
        return this.model.countDocuments({ categoryId })
    }

    async findNearbyServices(filter: NearbyServicesFilter): Promise<PaginatedResult<NearbyProviderDto>> {
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

        const providerMatch: any = {};
        if (filter.minRating) providerMatch.averageRating = { $gte: filter.minRating };
        if (filter.categoryId) providerMatch.serviceCategory = new mongoose.Types.ObjectId(filter.categoryId);

        if (Object.keys(providerMatch).length > 0) {
            pipeline.push({ $match: providerMatch });
        }

        pipeline.push({
            $lookup: {
                from: "providerservices",
                let: { pid: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$providerId", "$$pid"] },
                            status: ProviderServiceStatus.ACTIVE
                        }
                    }
                ],
                as: "services"
            }
        });

        const searchMatch: any = {};
        if (filter.search) {
            searchMatch["$or"] = [
                { "services.name": { $regex: filter.search, $options: "i" } },
                { businessName: { $regex: filter.search, $options: "i" } }
            ];
        }

        searchMatch["services.0"] = { $exists: true };

        if (Object.keys(searchMatch).length > 0) {
            pipeline.push({ $match: searchMatch });
        }

        const sortStage: any = {};
        if (filter.sortField === "averageRating") {
            sortStage.averageRating = filter.sortOrder === "asc" ? 1 : -1;
        } else if (!hasGeoNear) {
            sortStage.createdAt = -1;
        }

        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }

        const countPipeline = [...pipeline];
        countPipeline.push({ $count: "totalItems" });

        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: filter.limit });

        pipeline.push({
            $project: {
                id: "$_id",
                providerName: "$businessName",
                providerRating: "$averageRating",
                providerTotalReviews: "$totalReviews",
                providerLocation: "$location.address.city",
                distanceKm: { $divide: ["$distance", 1000] },
                serviceNames: "$services.name",
                startingPrice: { $min: "$services.startingPrice" }
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
            })),
            totalItems,
            page: filter.page,
            limit: filter.limit,
            totalPages: Math.ceil(totalItems / filter.limit)
        };
    }
}
