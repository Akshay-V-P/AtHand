import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ProviderDocument } from "../../domain/entities/ProviderDocument";
import { IProviderDocumentRepository } from "../../domain/repositories/IProviderDocumentRepository";
import { GetDocumentsDto } from "../dtos/GetDocumentsDto";

export class GetDocumentsUsecase implements IUsecase<GetDocumentsDto, ProviderDocument[] | null>{
    constructor(
        private readonly documentRepository: IProviderDocumentRepository,
    ) { }
    
    async execute(data: GetDocumentsDto): Promise<ProviderDocument[] | null> {
        if (!data || !data.id) {
            throw new BadRequestError("Provider ID is required.");
        }
        
        const documents = await this.documentRepository.findByProviderId(data.id);
        
        return documents;
    }
}