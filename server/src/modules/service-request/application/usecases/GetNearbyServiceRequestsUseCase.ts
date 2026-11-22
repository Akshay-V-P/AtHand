import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";

export class GetNearbyServiceRequestsUseCase {
    constructor(
        private serviceRequestRepository: IServiceRequestRepository,
        private providerRepository: IProviderRepository
    ) { }

    async execute(
        categoryId: string,
        lat: number,
        lng: number,
        radiusInKm: number,
        page: number,
        limit: number,
        excludeId:string,
    ): Promise<{ data: ServiceRequest[], total: number }> {
        const provider = excludeId
            ? await this.providerRepository.findByUserId(excludeId)
            : null;

        return await this.serviceRequestRepository.findNearbyRequests(
            categoryId,
            [lat, lng],
            radiusInKm,
            page,
            limit,
            excludeId,
            provider?.id
        );
    }
}
