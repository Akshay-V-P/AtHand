import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../domain/entities/Provider";
import { ProviderDraft } from "../../domain/entities/ProviderDraft";
import { IProviderDraftRepository } from "../../domain/repositories/IProviderDraftRepository";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { BusinessDetailsDraftDto } from "../dtos/BusinessDraftDto";
import { CreateProviderDto } from "../dtos/CreateProviderDto";
import { CreateProviderResponseDto } from "../dtos/CreateProviderResponseDto";

export class GetProvierDraftDetailsUsecase implements IUsecase<CreateProviderDto, ProviderDraft>{
    constructor(
        private readonly providerRepo: IProviderRepository,
        private readonly providerDraftRepo:IProviderDraftRepository,
    ) { }
    
    async execute(data: CreateProviderDto): Promise<ProviderDraft> {

        const providerDraft = await this.providerDraftRepo.findByUserId(data.userId)

        if (!providerDraft) throw new NotFoundError("Provider draft not found")
        
        return providerDraft

    }
}