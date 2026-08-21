
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { IDocuments, ProviderDraft } from "../../../provider/domain/entities/ProviderDraft";
import { IProviderDocumentRepository } from "../../../provider/domain/repositories/IProviderDocumentRepository";
import { IProviderDraftRepository } from "../../../provider/domain/repositories/IProviderDraftRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { BusinessDetailsDraftDto } from "../dtos/BusinessDraftDto";

export class UploadBusinessDetailsDraftUsecase implements IUsecase<BusinessDetailsDraftDto, ProviderDraft | null>{
    constructor(
        private readonly providerDraftRepo: IProviderDraftRepository,
        private readonly providerRepo: IProviderRepository,
        private readonly documentRepo:IProviderDocumentRepository,
    ) { }
    
    async execute(data: BusinessDetailsDraftDto): Promise<ProviderDraft | null> {
        let providerDraft = await this.providerDraftRepo.findByUserId(data.userId)

        
        const provider = await this.providerRepo.findByUserId(data.userId)
        let documents 
        if (provider && provider.id) {
            documents = await this.documentRepo.findByProviderId(provider.id)
        } else {
            documents = data.documents
        }

        
        if (!providerDraft) {
            const newProviderDraft = new ProviderDraft(
                data.userId,
                data.businessDetails,
                data.locationDetails,
                data.serviceDetails,
                documents as IDocuments[],
            )
            return this.providerDraftRepo.create(newProviderDraft)
        }
        console.log("document is this :",data.documents)

        const updateData = {...data, documents}
        return this.providerDraftRepo.update(data.userId, data)
        
    }
}