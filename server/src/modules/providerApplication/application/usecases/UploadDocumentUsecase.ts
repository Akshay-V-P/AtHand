import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { DocumentType, ProviderDocument } from "../../../provider/domain/entities/ProviderDocument";
import { DocumentVerificationStatus } from "../../../provider/domain/enums/DocumentVerificationStatus";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { IProviderDocumentRepository } from "../../../provider/domain/repositories/IProviderDocumentRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { DocumentUploadDTO } from "../dtos/DocumentUploadDto";

export class UploadDocumentUsecase implements IUsecase<DocumentUploadDTO, ProviderDocument>{
    constructor(
        private readonly providerDocumentRepo: IProviderDocumentRepository,
        private readonly providerRepo:IProviderRepository,
    ) { }
    
    async execute(data: DocumentUploadDTO): Promise<ProviderDocument> {
            
        const provider = await this.providerRepo.findById(data.providerId)
        
        if (!provider) throw new NotFoundError("Unable to find provider")
        if (provider.status === ProviderStatus.BLOCKED) throw new UnauthorizedError("Provider is blocked by admin")
        
        const documentExists = await this.providerDocumentRepo.findByDocumentType(data.providerId, data.documentType)
        if (documentExists) {
            console.log("document Type is this: ",data.documentType)
            const document = await this.providerDocumentRepo.update(data.providerId, { documentKey: data.documentKey })
          
            return document!
        }
        
        
        const newDocument = new ProviderDocument(
            data.providerId,
            data.documentType,
            data.documentKey,
            DocumentVerificationStatus.PENDING
        )
        return await this.providerDocumentRepo.create(newDocument)
    }
}