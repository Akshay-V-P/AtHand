import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestDTO } from "../dtos/ServiceRequestDTOs";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";

export class CreateServiceRequestUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
        const serviceRequest = new ServiceRequest(
            dto.userId,
            dto.categoryId,
            dto.address,
            dto.title,
            dto.description,
            dto.urgency,
            dto.onSite ?? true,
            dto.media,
            dto.productBrand ?? '',
            dto.productModel ?? '',
            undefined, 
            dto.preferredDate,
            dto.preferredTimeSlot
        );

        return await this.serviceRequestRepository.save(serviceRequest);
    }
}
