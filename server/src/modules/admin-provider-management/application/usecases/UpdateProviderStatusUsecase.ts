import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../../provider/domain/entities/Provider";
import { DocumentVerificationStatus } from "../../../provider/domain/enums/DocumentVerificationStatus";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { IProviderDocumentRepository } from "../../../provider/domain/repositories/IProviderDocumentRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { UpdateProviderStatusDTO } from "../dtos/UpdateProviderStatusDTO";

export class UpdateProviderStatusUsecase implements IUsecase<UpdateProviderStatusDTO, Provider>{
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly documentRepository:IProviderDocumentRepository,
    ) { }
    
    async execute(data: UpdateProviderStatusDTO): Promise<Provider> {
        const payload = {
            status:data.status
        }

        const provider = await this.providerRepository.findById(data.id)
        if(!provider) throw new NotFoundError("Provider not found")

        if (data.status == ProviderStatus.ACTIVE) {
            const documents = await this.documentRepository.findByProviderId(data.id)
            if (!documents || documents.length <= 0) throw new BadRequestError("Cannot approve provider, No documents uploaded")
            
            const allVerified = documents?.every(doc => doc.verificationStatus == DocumentVerificationStatus.APPROVED)
            if(!allVerified) throw new BadRequestError("Cannot approve provider, documents not verified")
        }

        console.log(payload)
        const updatedProvider = await this.providerRepository.update(data.id, payload)
        if (!updatedProvider) throw new NotFoundError("Provider not found")
        
        return updatedProvider
    }
}