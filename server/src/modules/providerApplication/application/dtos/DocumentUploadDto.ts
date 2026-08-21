import { DocumentType } from "../../../provider/domain/entities/ProviderDocument";

export interface DocumentUploadDTO{
    providerId: string;
    documentType: DocumentType;
    documentKey: string;
}