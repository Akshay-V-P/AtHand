import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";

export class GetNearbyServiceRequestsUseCase {
    constructor(private serviceRequestRepository: IServiceRequestRepository) { }

    async execute(
        categoryId: string,
        lat: number,
        lng: number,
        radiusInKm: number,
        page: number,
        limit: number
    ): Promise<{ data: ServiceRequest[], total: number }> {
        return await this.serviceRequestRepository.findNearbyRequests(
            categoryId,
            [lat, lng],
            radiusInKm,
            page,
            limit
        );
    }
}
