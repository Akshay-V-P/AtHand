import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { DocumentType } from "../../../domain/entities/ProviderDocument";
import { ProviderDraft } from "../../../domain/entities/ProviderDraft";
import { DocumentVerificationStatus } from "../../../domain/enums/DocumentVerificationStatus";
import { IProviderDraftRepository } from "../../../domain/repositories/IProviderDraftRepository";
import ProviderDraftMapper from "../mappers/ProviderDraftMapper";
import ProviderDraftModel, { ProviderDraftSchemaType } from "../models/ProviderDraftModel";

export class ProviderDraftRepository extends BaseRepository<ProviderDraftSchemaType> implements IProviderDraftRepository{
    constructor() {
        super(ProviderDraftModel)
    }

    async findByUserId(userId: string): Promise<ProviderDraft | null> {
        const providerDraft = await ProviderDraftModel.findOne({ userId })
        if (!providerDraft) return null
        return ProviderDraftMapper.toDomain(providerDraft)
    }

    async create(providerDraft: ProviderDraft): Promise<ProviderDraft> {
        const newProviderDraft = await this.createDocument(ProviderDraftMapper.toMongoose(providerDraft))
        return ProviderDraftMapper.toDomain(newProviderDraft)
    }

    async update(userId: string, updateData: Partial<ProviderDraft>): Promise<ProviderDraft | null> {
        
        const updatedProviderDraft = await ProviderDraftModel.findOneAndUpdate({ userId }, updateData, { returnDocument:'after'})
        if (!updatedProviderDraft) return null
        return ProviderDraftMapper.toDomain(updatedProviderDraft)
    }

    async updateDocumentByProviderId(providerId: string, updateData: { verificationStatus: DocumentVerificationStatus; documentType: DocumentType; remarks?: string; }): Promise<ProviderDraft | null> {
        console.log(updateData.documentType)
        const updatedProviderDraft = await ProviderDraftModel.findOneAndUpdate(
            { 
                documents: {
                    $elemMatch: {
                        providerId: providerId,
                        documentType: updateData.documentType
                    }
                }
            } as any,
            { 
                $set: { 
                    "documents.$.verificationStatus": updateData.verificationStatus,
                    "documents.$.remarks": updateData.remarks || ""
                } 
            },
            { returnDocument: 'after' }
        );

        if (!updatedProviderDraft) return null;
        return ProviderDraftMapper.toDomain(updatedProviderDraft);
    }
    
}