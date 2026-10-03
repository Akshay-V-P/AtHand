import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { GetServiceRequestsDTO } from "../dtos/ServiceRequestDTOs";

export class GetUserServiceRequestsUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(dto: GetServiceRequestsDTO): Promise<{ data: ServiceRequest[], total: number }> {
        return await this.serviceRequestRepository.findByUserId(
            dto.userId,
            dto.page,
            dto.limit,
            dto.status
        );
    }
}
