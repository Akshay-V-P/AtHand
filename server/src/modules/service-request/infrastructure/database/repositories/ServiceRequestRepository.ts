import { IServiceRequestRepository } from "../../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../../domain/entities/ServiceRequest";
import ServiceRequestModel from "../models/ServiceRequestModel";
import { ServiceRequestMapper } from "../../mappers/ServiceRequestMapper";
import { ServiceRequestStatus } from "../../../domain/enums/ServiceRequestStatus";

export class ServiceRequestRepository implements IServiceRequestRepository {
    async save(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
        const persistenceModel = ServiceRequestMapper.toPersistence(serviceRequest);
        const created = await ServiceRequestModel.create(persistenceModel);
        return ServiceRequestMapper.toDomain(created);
    }

    async findById(id: string): Promise<ServiceRequest | null> {
        const document = await ServiceRequestModel.findById(id).lean();
        if (!document) return null;
        return ServiceRequestMapper.toDomain(document);
    }

    async findByUserId(userId: string, page: number, limit: number, status?: ServiceRequestStatus): Promise<{ data: ServiceRequest[], total: number }> {
        const query: any = { userId };
        if (status) query.status = status;

        const [documents, total] = await Promise.all([
            ServiceRequestModel.find(query)
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
        ).lean();
        if (!document) return null;
        return ServiceRequestMapper.toDomain(document);
    }
}
