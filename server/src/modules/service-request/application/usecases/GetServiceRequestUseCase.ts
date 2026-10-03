import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";

export class GetServiceRequestUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(id: string, userId: string): Promise<ServiceRequest | null> {
        const request = await this.serviceRequestRepository.findById(id);

        if (!request) {
            throw new Error("ServiceRequestNotFound");
        }

        // Simple authorization check for now, can be extended for admins/providers
        if (request.userId !== userId) {
            throw new Error("UnauthorizedServiceRequestAccess");
        }

        return request;
    }
}
