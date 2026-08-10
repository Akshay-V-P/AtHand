import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../domain/entities/Provider";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";
import { IProviderDraftRepository } from "../../domain/repositories/IProviderDraftRepository";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { CreateProviderDto } from "../dtos/CreateProviderDto";
import { CreateProviderResponseDto } from "../dtos/CreateProviderResponseDto";

export class CreateProviderUsecase implements IUsecase<CreateProviderDto, CreateProviderResponseDto> {
    constructor(
        private readonly providerRepo: IProviderRepository,
        private readonly providerDraftRepo: IProviderDraftRepository,
    ) { }

    async execute(
        data: CreateProviderDto
    ): Promise<CreateProviderResponseDto> {

        const providerDraft =
            await this.providerDraftRepo.findByUserId(data.userId);

        if (!providerDraft) {
            throw new NotFoundError(
                "Provider details not found. Please add details"
            );
        }

        // Make sure the draft is complete
        if (
            !providerDraft.businessDetails ||
            !providerDraft.locationDetails ||
            !providerDraft.serviceDetails
        ) {
            throw new BadRequestError("All details required");
        }

        // Check whether provider was already initialized
        const existingProvider =
            await this.providerRepo.findByUserId(data.userId);

        if (existingProvider) {

            if (!existingProvider.id) {
                throw new BadRequestError("Provider ID is missing");
            }

            return {
                id: existingProvider.id,
                userId: existingProvider.userId,
                businessName: existingProvider.businessName,
                status: existingProvider.status,
            };
        }

        // Check email only when creating a new provider
        const isEmailExists =
            await this.providerRepo.findByEmail(
                providerDraft.businessDetails.email
            );

        if (isEmailExists) {
            throw new ConflictError("Email is already in use");
        }

        // Validate location
        const [longitude, latitude] =
            providerDraft.locationDetails.coordinates.coordinates;

        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new BadRequestError(
                "Invalid location coordinates"
            );
        }

        // Validate service radius
        const serviceRadius =
            providerDraft.serviceDetails.serviceRadius;

        if (serviceRadius < 0 || serviceRadius > 30) {
            throw new BadRequestError(
                "Service radius must be between 0 and 30 km."
            );
        }

        const newProvider = new Provider(
            providerDraft.userId,
            providerDraft.businessDetails.businessName,
            providerDraft.businessDetails.contactPerson,
            providerDraft.businessDetails.phone,
            providerDraft.businessDetails.email,
            providerDraft.serviceDetails.serviceCategory,
            providerDraft.locationDetails,
            serviceRadius,
            ProviderStatus.DRAFT,
            0,
            0,
            0,
            0,
        );

        const provider =
            await this.providerRepo.create(newProvider);

        if (!provider.id) {
            throw new BadRequestError(
                "Provider was created but ID is missing"
            );
        }

        return {
            id: provider.id,
            userId: provider.userId,
            businessName: provider.businessName,
            status: provider.status,
        };
    }
}