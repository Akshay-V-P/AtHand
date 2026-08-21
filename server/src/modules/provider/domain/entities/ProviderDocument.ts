import { DocumentVerificationStatus } from "../enums/DocumentVerificationStatus";

export enum DocumentType {
    TECHNICAL_CERTIFICATE = "TECHNICAL CERTIFICATE",
    BUSINESS_LICENSE = "BUSINESS LICENSE",
    GOVERNMENT_ID_FRONT = "GOVERNMENT ID FRONT",
    GOVERNMENT_ID_BACK = "GOVERNMENT ID BACK"
}

export class ProviderDocument{
    constructor(
        public readonly providerId: string,
        public readonly documentType: DocumentType,
        public readonly documentKey: string,
        public readonly verificationStatus: DocumentVerificationStatus,
        public readonly remarks?: string,
        public readonly id?: string,
    ){}
}