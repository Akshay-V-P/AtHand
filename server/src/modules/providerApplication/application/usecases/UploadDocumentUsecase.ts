import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { DocumentType, ProviderDocument } from "../../domain/entities/ProviderDocument";
import { DocumentVerificationStatus } from "../../domain/enums/DocumentVerificationStatus";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";
import { IProviderDocumentRepository } from "../../domain/repositories/IProviderDocumentRepository";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { DocumentUploadDTO } from "../dtos/DocumentUploadDto";
import { IUsecase } from "../interfaces/IUsecase";

export class UploadDocumentUsecase implements IUsecase<DocumentUploadDTO, void>{
    constructor(
        private readonly providerDocumentRepo: IProviderDocumentRepository,
        private readonly providerRepo:IProviderRepository,
    ) { }
    
    async execute(data: DocumentUploadDTO): Promise<void> {
            
        const provider = await this.providerRepo.findById(data.providerId)
        
        if (!provider) throw new NotFoundError("Unable to find provider")
        if (provider.status === ProviderStatus.BLOCKED) throw new UnauthorizedError("Provider is blocked by admin")
        
        const documentExists = await this.providerDocumentRepo.findByDocumentType(data.providerId, data.documentType)
        if(documentExists) throw new ConflictError("Document already exists")
        
        const documentCount = await this.providerDocumentRepo.findDocumentCount(data.providerId)
        if (documentCount >= 4) throw new BadRequestError("Maximum number of document reached")
        
        const newDocument = new ProviderDocument(
            data.providerId,
            data.documentType,
            data.documentUrl,
            DocumentVerificationStatus.PENDING
        )
        await this.providerDocumentRepo.create(newDocument)
    }
}