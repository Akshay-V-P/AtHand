import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { IProviderDocumentRepository } from "../../../provider/domain/repositories/IProviderDocumentRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { DocumentVerificationStatus } from "../../../provider/domain/enums/DocumentVerificationStatus";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { ProviderDocumentUpdateDTO } from "../../../providerApplication/application/dtos/ProviderDocumentUpdateDTO";
import { IProviderDraftRepository } from "../../domain/repositories/IProviderDraftRepository";
import { IDocuments } from "../../domain/entities/ProviderDraft";

export interface UpdateDocumentRequest {
    id: string;
    updateData: ProviderDocumentUpdateDTO;
}

export class UpdateDocumentUsecase implements IUsecase<UpdateDocumentRequest, void> {
    constructor(
        private readonly documentRepository: IProviderDocumentRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly providerDraftRepository: IProviderDraftRepository,
    ) { }

    async execute(request: UpdateDocumentRequest): Promise<void> {
        const { id, updateData } = request;

        const existingDocument = await this.documentRepository.findByid(id);

        if (!existingDocument) {
            throw new Error(`Document with ID ${id} not found.`);
        }


        const updatedDocument = await this.documentRepository.updateById(id, updateData);



        if (!updatedDocument) {
            throw new Error(`An error occurred while updating the document with ID ${id}.`);
        }

        if (updateData.verificationStatus === DocumentVerificationStatus.REJECTED) {

            const providerId = existingDocument.providerId;

            await this.providerRepository.update(providerId, {
                status: ProviderStatus.DRAFT
            });
        }

        const provider = await this.providerRepository.findById(existingDocument.providerId)


        const documents = await this.documentRepository.findByProviderId(provider?.id!) as IDocuments[]
        
        const providerDraft = await this.providerDraftRepository.update(provider?.userId!, {documents})

        if(!providerDraft) throw new Error("Cant update provider draft")
    }
}