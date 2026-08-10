import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { ProviderDocumentUpdateDTO } from "../../../application/dtos/ProviderDocumentUpdateDTO";
import { DocumentType, ProviderDocument } from "../../../domain/entities/ProviderDocument";
import { IProviderDocumentRepository } from "../../../domain/repositories/IProviderDocumentRepository";
import { DocumentMapper } from "../mappers/DocumentMapper";
import DocumentModel, { DocumentSchemaType } from "../models/DocumentModel";

export class ProviderDocumentRepository extends BaseRepository<DocumentSchemaType> implements IProviderDocumentRepository{

    constructor() {
        super(DocumentModel)
    }

    async findByProviderId(providerId: string): Promise<ProviderDocument[] | null> {
        const documents = await DocumentModel.find({ providerId })
        if (!documents) return null
        return DocumentMapper.toDomainArray(documents)
    }

    async findByid(id: string): Promise<ProviderDocument | null> {
        const document = await this.findDocumentById(id)
        if (!document) return null
        return DocumentMapper.toDomain(document)
    }

    async create(providerDocument: ProviderDocument): Promise<ProviderDocument> {
        const documentMongoType = DocumentMapper.toMongoose(providerDocument)
        const newDocument = await this.createDocument(documentMongoType)
        return DocumentMapper.toDomain(newDocument)
    }

    async update(id: string, updateData: ProviderDocumentUpdateDTO): Promise<ProviderDocument | null> {
        const updatedDocument = await DocumentModel.findOneAndUpdate({providerId:id}, updateData, {returnDocument:'after'})
        console.log(updatedDocument)
        if (!updatedDocument) return null
        return DocumentMapper.toDomain(updatedDocument)
    }

    async findDocumentCount(providerId: string): Promise<number> {
        const documents = await DocumentModel.find({ providerId })
        if (!documents) return 0
        return documents.length
    }

    async findByDocumentType(providerId: string, documentType: DocumentType): Promise<ProviderDocument | null> {
        const document = await DocumentModel.findOne({ providerId, documentType })
        if (!document) return null
        return DocumentMapper.toDomain(document)
    }
}