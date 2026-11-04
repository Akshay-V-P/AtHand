import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";

export class GetServiceRequestUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(id: string, userId: string): Promise<ServiceRequest | null> {
        const request = await this.serviceRequestRepository.findById(id);

        if (!request) {
            throw new NotFoundError("Service Request not found");
        }

        const isOwner = request.userId.toString() == userId.toString()

        const isAccessible = request.providerId?.toString() == userId.toString() || request.status == ServiceRequestStatus.OPEN

        if (!isOwner && !isAccessible) {
            throw new UnauthorizedError("Unauthorized access to service request");
        }

        return request;
    }
}
