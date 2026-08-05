import { DocumentType } from "../../domain/entities/ProviderDocument";

export interface DocumentUploadDTO{
    providerId: string;
    documentType: DocumentType;
    documentUrl: string;
}