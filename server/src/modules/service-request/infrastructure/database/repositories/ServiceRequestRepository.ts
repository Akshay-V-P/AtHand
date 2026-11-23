import mongoose from "mongoose";
import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import ServiceRequestModel from "../models/ServiceRequestModel";
import { ServiceRequestMapper } from "../../mappers/ServiceRequestMapper";
import { ServiceRequestStatus } from "../../../domain/enums/ServiceRequestStatus";

export class ServiceRequestRepository implements IServiceRequestRepository {
    async save(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
        const persistenceModel = ServiceRequestMapper.toPersistence(serviceRequest);
        const created = await ServiceRequestModel.create(persistenceModel);
        const populated = await ServiceRequestModel.findById(created._id)
            .populate("providerId", "businessName location averageRating totalReviews")
            .populate("providerServiceId", "name startingPrice")
            .populate("categoryId", "name commissionPercentage")
            .lean();
        return ServiceRequestMapper.toDomain(populated || created);
    }

    async findById(id: string): Promise<ServiceRequest | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const document = await ServiceRequestModel.findById(id)
            .populate("providerId", "businessName location averageRating totalReviews")
            .populate("providerServiceId", "name startingPrice")
            .populate("categoryId", "name commissionPercentage")
            .lean();
        if (!document) return null;
        return ServiceRequestMapper.toDomain(document);
    }

    async findByUserId(userId: string, page: number, limit: number, status?: ServiceRequestStatus): Promise<{ data: ServiceRequest[], total: number }> {
        const query: any = { userId };
        if (status) query.status = status;

        const [documents, total] = await Promise.all([
            ServiceRequestModel.find(query)
                .populate("providerId", "businessName location averageRating totalReviews")
                .populate("providerServiceId", "name startingPrice")
                .populate("categoryId", "name commissionPercentage")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ServiceRequestModel.countDocuments(query)
        ]);

        return {
            data: documents.map((doc: any) => ServiceRequestMapper.toDomain(doc)),
            total
        };
    }

    async update(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
        const document = await ServiceRequestModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        )
            .populate("providerId", "businessName location averageRating totalReviews")
            .populate("providerServiceId", "name startingPrice")
            .populate("categoryId", "name commissionPercentage")
            .lean();
        if (!document) return null;
        return ServiceRequestMapper.toDomain(document);
    }

    async findNearbyRequests(
        categoryId: string,
        coordinates: [number, number],
        maxDistanceInKm: number,
        page: number,
        limit: number,
        excludeId: string,
        providerId?: string,
    ): Promise<{ data: ServiceRequest[]; total: number }> {
        const broadcastQuery: any = {
            categoryId,
            status: ServiceRequestStatus.OPEN,
            userId: { $ne: excludeId },
            $or: [
                { providerId: { $exists: false } },
                { providerId: null }
            ],
            "address.coordinates": {
                $geoWithin: {
                    $centerSphere: [
                        [coordinates[0], coordinates[1]],
                        maxDistanceInKm / 6378.1 
                    ]
                }
            }
        };

        const query: any =
            providerId && mongoose.Types.ObjectId.isValid(providerId)
                ? {
                    $or: [
                        broadcastQuery,
                        {
                            providerId: new mongoose.Types.ObjectId(providerId),
                            status: { $in: [ServiceRequestStatus.OPEN, ServiceRequestStatus.QUOTING] },
                            userId: { $ne: excludeId }
                        }
                    ]
                }
                : broadcastQuery;

        const [documents, total] = await Promise.all([
            ServiceRequestModel.find(query)
                .populate("providerServiceId", "name startingPrice")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ServiceRequestModel.countDocuments(query)
        ]);

        return {
            data: documents.map((doc: any) => ServiceRequestMapper.toDomain(doc)),
            total
        };
    }
}
