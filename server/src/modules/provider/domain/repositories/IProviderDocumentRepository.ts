
import { ProviderDocumentUpdateDTO } from "../../../providerApplication/application/dtos/ProviderDocumentUpdateDTO";
import { DocumentType, ProviderDocument } from "../entities/ProviderDocument";

export interface IProviderDocumentRepository{
    create(providerDocument: ProviderDocument): Promise<ProviderDocument>;
    update(id: string, updateData: ProviderDocumentUpdateDTO): Promise<ProviderDocument | null>;
    findByid(id: string): Promise<ProviderDocument | null>;
    findByProviderId(providerId: string): Promise<ProviderDocument[] | null>;
    findDocumentCount(providerId: string): Promise<number>;
    findByDocumentType(providerId: string, documentType: DocumentType): Promise<ProviderDocument | null>;
}