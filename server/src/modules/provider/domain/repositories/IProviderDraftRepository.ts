import { DocumentType } from "../entities/ProviderDocument";
import { ProviderDraft } from "../entities/ProviderDraft";
import { DocumentVerificationStatus } from "../enums/DocumentVerificationStatus";

export interface IProviderDraftRepository{
    findByUserId(userId: string): Promise<ProviderDraft | null>;
    create(providerDraft: ProviderDraft): Promise<ProviderDraft>;
    update(userId: string, updateData: Partial<ProviderDraft>): Promise<ProviderDraft | null>;
    updateDocumentByProviderId(providerId: string, updateData: { verificationStatus: DocumentVerificationStatus; documentType: DocumentType; remarks?: string; }): Promise<ProviderDraft | null>;
}