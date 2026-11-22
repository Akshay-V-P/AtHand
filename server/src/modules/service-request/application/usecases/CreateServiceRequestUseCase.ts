import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestDTO } from "../dtos/ServiceRequestDTOs";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";

export class CreateServiceRequestUseCase {
    constructor(
        private serviceRequestRepository: IServiceRequestRepository,
        private providerRepository: IProviderRepository
    ) { }

    async execute(dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
        let resolvedCategoryId = dto.categoryId;

        if (dto.providerId) {
            const provider = await this.providerRepository.findById(dto.providerId);
            if (!provider) {
                throw new NotFoundError("Selected provider not found");
            }

            const isProviderActive =
                provider.status === ProviderStatus.ACTIVE ||
                (provider.status as string) === "APPROVED";

            if (!isProviderActive) {
                throw new BadRequestError("This provider is currently unavailable for requests");
            }

            if (provider.userId.toString() === dto.userId.toString()) {
                throw new BadRequestError("You cannot create a service request for your own provider profile");
            }

            if (!resolvedCategoryId) {
                resolvedCategoryId =
                    typeof provider.serviceCategory === "object"
                        ? (provider.serviceCategory as any)?._id?.toString() || ""
                        : provider.serviceCategory;
            }
        }

        if (!resolvedCategoryId) {
            throw new BadRequestError("Category is required");
        }

        const serviceMode = dto.serviceMode || (dto.onSite === false ? "WORKSHOP" : "ONSITE");
        const onSite = dto.onSite ?? serviceMode === "ONSITE";

        const requestCountPerWeek = await this.serviceRequestRepository

        const serviceRequest = new ServiceRequest(
            dto.userId,
            resolvedCategoryId,
            dto.address,
            dto.title,
            dto.description,
            dto.urgency,
            onSite,
            dto.media,
            dto.productBrand ?? '',
            dto.productModel ?? '',
            undefined, 
            dto.preferredDate,
            dto.preferredTimeSlot,
            undefined,
            dto.providerId,
            undefined,
            serviceMode,
            dto.providerServiceId
        );

        return await this.serviceRequestRepository.save(serviceRequest);
    }
}
