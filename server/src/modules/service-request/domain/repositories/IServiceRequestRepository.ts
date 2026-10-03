import { ServiceRequest } from "../entities/ServiceRequest";
import { ServiceRequestStatus } from "../enums/ServiceRequestStatus";

export interface IServiceRequestRepository {
    save(serviceRequest: ServiceRequest): Promise<ServiceRequest>;
    findById(id: string): Promise<ServiceRequest | null>;
    findByUserId(userId: string, page: number, limit: number, status?: ServiceRequestStatus): Promise<{ data: ServiceRequest[], total: number }>;
    update(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest | null>;
}
