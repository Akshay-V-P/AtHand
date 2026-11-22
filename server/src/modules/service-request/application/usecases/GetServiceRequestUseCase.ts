import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";

export class GetServiceRequestUseCase {
    constructor(
        private serviceRequestRepository: IServiceRequestRepository,
        private providerRepository: IProviderRepository
    ) { }

    async execute(id: string, userId: string): Promise<ServiceRequest | null> {
        const request = await this.serviceRequestRepository.findById(id);

        if (!request) {
            throw new NotFoundError("Service Request not found");
        }

        const isOwner = request.userId.toString() === userId.toString();

        let isAccessible = false;
        if (request.providerId) {
            if (request.providerId.toString() === userId.toString()) {
                isAccessible = true;
            } else {
                const provider = await this.providerRepository.findByUserId(userId);
                isAccessible = Boolean(provider?.id && provider.id.toString() === request.providerId.toString());
            }
        } else {
            isAccessible =
                request.status === ServiceRequestStatus.OPEN ||
                request.status === ServiceRequestStatus.QUOTING;
        }

        if (!isOwner && !isAccessible) {
            throw new UnauthorizedError("Unauthorized access to service request");
        }

        return request;
    }
}
