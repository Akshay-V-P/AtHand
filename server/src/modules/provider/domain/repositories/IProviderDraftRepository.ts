import { ProviderDraft } from "../entities/ProviderDraft";

export interface IProviderDraftRepository{
    findByUserId(userId: string): Promise<ProviderDraft | null>;
    create(providerDraft: ProviderDraft): Promise<ProviderDraft>;
    update(userId: string, updateData: Partial<ProviderDraft>): Promise<ProviderDraft | null>;
}