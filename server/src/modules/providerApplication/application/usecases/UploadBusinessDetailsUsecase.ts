
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ProviderDraft } from "../../domain/entities/ProviderDraft";
import { IProviderDraftRepository } from "../../domain/repositories/IProviderDraftRepository";
import { BusinessDetailsDraftDto } from "../dtos/BusinessDraftDto";

export class UploadBusinessDetailsDraftUsecase implements IUsecase<BusinessDetailsDraftDto, ProviderDraft | null>{
    constructor(
        private readonly providerDraftRepo:IProviderDraftRepository,
    ) { }
    
    async execute(data: BusinessDetailsDraftDto): Promise<ProviderDraft | null> {
        let providerDraft = await this.providerDraftRepo.findByUserId(data.userId)

        
        if (!providerDraft) {
            const newProviderDraft = new ProviderDraft(
                data.userId,
                data.businessDetails,
                data.locationDetails,
                data.serviceDetails,
                data.documents,
            )
            return this.providerDraftRepo.create(newProviderDraft)
        }

        return this.providerDraftRepo.update(data.userId, data)
        
    }
}