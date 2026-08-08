import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ProviderDraft } from "../../../domain/entities/ProviderDraft";
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
}