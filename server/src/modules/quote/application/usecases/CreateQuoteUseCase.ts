import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { CreateQuoteDto } from "../dtos/CreateQuoteDto";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";
import { QuoteStatus } from "../../domain/enums/QuoteStatus";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { ServiceRequestStatus } from "../../../service-request/domain/enums/ServiceRequestStatus";

export class CreateQuoteUseCase implements IUsecase<CreateQuoteDto, Quote> {
    constructor(
        private quoteRepository: IQuoteRepository,
        private serviceRequestRepository: IServiceRequestRepository,
        private providerRepository: IProviderRepository
    ) { }

    async execute(dto: CreateQuoteDto): Promise<Quote> {
        const serviceRequest = await this.serviceRequestRepository.findById(dto.requestId);
        if (!serviceRequest) {
            throw new NotFoundError("Service request not found");
        }

        if (
            serviceRequest.status !== ServiceRequestStatus.OPEN &&
            serviceRequest.status !== ServiceRequestStatus.QUOTING
        ) {
            throw new BadRequestError("This service request is no longer accepting quotes");
        }

        if (serviceRequest.providerId) {
            const targetProviderId = serviceRequest.providerId.toString();
            let isTargetProvider = targetProviderId === dto.providerId.toString();

            if (!isTargetProvider) {
                const providerByUser = await this.providerRepository.findByUserId(dto.providerId);
                isTargetProvider = Boolean(
                    providerByUser?.id && providerByUser.id.toString() === targetProviderId
                );
            }

            if (!isTargetProvider) {
                throw new UnauthorizedError("This service request was sent exclusively to another provider");
            }
        }

        const quote = new Quote(
            dto.requestId,
            dto.providerId,
            dto.estimatedTotal,
            dto.laborCost,
            dto.partsCost,
            dto.estimatedRepairTime,
            dto.technicalNotes,
            QuoteStatus.PENDING,
            dto.includeWarrenty
        );

        return await this.quoteRepository.create(quote);
    }
}
