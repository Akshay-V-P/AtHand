import { DocumentVerificationStatus } from "../enums/DocumentVerificationStatus";

export enum DocumentType {
    TECHNICAL_CERTIFICATE = "TECHNICAL CERTIFICATE",
    BUSINESS_LICENSE = "BUSINESS LICENSE",
    GOVERNMENT_ID = "GOVERNMENT ID",
}

export class ProviderDocument{
    constructor(
        public readonly providerId: string,
        public readonly documentType: DocumentType,
        public readonly documentUrl: string,
        public readonly verificationStatus: DocumentVerificationStatus,
        public readonly remarks?: string,
        public readonly id?: string,
    ){}
}