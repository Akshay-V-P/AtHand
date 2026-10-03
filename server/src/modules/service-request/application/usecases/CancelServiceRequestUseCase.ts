import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";

export class CancelServiceRequestUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(id: string, userId: string): Promise<ServiceRequest | null> {
        const request = await this.serviceRequestRepository.findById(id);

        if (!request) {
            throw new Error("ServiceRequestNotFound");
        }

        if (request.userId !== userId) {
            throw new Error("UnauthorizedServiceRequestAccess");
        }

        if (request.status !== ServiceRequestStatus.OPEN && request.status !== ServiceRequestStatus.QUOTING) {
            throw new Error("InvalidServiceRequestStatus");
        }

        return await this.serviceRequestRepository.update(id, { status: ServiceRequestStatus.CANCELLED });
    }
}
