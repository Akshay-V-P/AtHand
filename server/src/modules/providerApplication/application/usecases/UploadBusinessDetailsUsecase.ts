
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ProviderDraft } from "../../domain/entities/ProviderDraft";
import { IProviderDraftRepository } from "../../domain/repositories/IProviderDraftRepository";
import { BusinessDetailsDraftDto } from "../dtos/BusinessDraftDto";
import { IUsecase } from "../interfaces/IUsecase";

export class UploadBusinessDetailsDraftUsecase implements IUsecase<BusinessDetailsDraftDto, ProviderDraft | null>{
    constructor(
        private readonly providerDraftRepo:IProviderDraftRepository,
    ) { }
    
    async execute(data: BusinessDetailsDraftDto): Promise<ProviderDraft | null> {
        let providerDraft = await this.providerDraftRepo.findByUserId(data.userId)
        const [longitude, latitude] = data.locationDetails.coordinates.coordinates
        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new BadRequestError("Invalid location coordinates")
        }
        if (!providerDraft) {
            if (!data.businessDetails.businessName) throw new BadRequestError("Please provide all business details")
            const newProviderDraft = new ProviderDraft(
                data.userId,
                data.businessDetails,
                data.locationDetails,
                data.serviceDetails,
                data.documents,
            )
            providerDraft = await this.providerDraftRepo.create(newProviderDraft)
            return providerDraft
        }

        return this.providerDraftRepo.update(data.userId, data)
        
    }
}