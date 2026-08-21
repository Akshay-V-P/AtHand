import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../domain/entities/Provider";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { BusinessDetailsDraftDto } from "../../../providerApplication/application/dtos/BusinessDraftDto";
import { GetProviderDto } from "../dtos/GetProviderDto";
import { GetProviderResponseDto } from "../../../providerApplication/application/dtos/GetProviderResponseDto";

export class GetProviderUsecase implements IUsecase<GetProviderDto, Provider>{
    constructor(
        private readonly providerRepo:IProviderRepository,
    ) { }
    
    async execute(data: GetProviderDto): Promise<Provider> {
        if (!data.id) throw new BadRequestError("Please provide user id")
        
        const provider = await this.providerRepo.findById(data.id)
        if (!provider) throw new NotFoundError("Provider not found")
        
        return provider
    }
}