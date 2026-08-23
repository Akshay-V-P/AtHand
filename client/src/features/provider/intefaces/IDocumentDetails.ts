import type { DocumentVerificationStatus } from "../enum/DocumentVerificationStatus";

export interface IDocumentDetails{
    providerId: string,
    documentType: string,
    documentKey: string,
    verificationStatus: DocumentVerificationStatus,
    remarks?: string,
    id?: string,
}