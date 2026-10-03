import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { UpdateServiceRequestDTO } from "../dtos/ServiceRequestDTOs";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";

export class UpdateServiceRequestUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(dto: UpdateServiceRequestDTO, userId: string): Promise<ServiceRequest | null> {
        const request = await this.serviceRequestRepository.findById(dto.id);

        if (!request) {
            throw new Error("ServiceRequestNotFound");
        }

        if (request.userId !== userId) {
            throw new Error("UnauthorizedServiceRequestAccess");
        }

        // Only allow updates if OPEN
        if (request.status !== "OPEN") {
            throw new Error("InvalidServiceRequestStatus");
        }

        // Build partial updates
        const updates: any = {};
        if (dto.title) updates.title = dto.title;
        if (dto.description) updates.description = dto.description;
        if (dto.urgency) updates.urgency = dto.urgency;
        if (dto.media) updates.media = dto.media;
        if (dto.preferredDate) updates.preferredDate = dto.preferredDate;
        if (dto.preferredTimeSlot) updates.preferredTimeSlot = dto.preferredTimeSlot;

        return await this.serviceRequestRepository.update(dto.id, updates);
    }
}
