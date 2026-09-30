import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../domain/entities/Provider";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { BusinessDetailsDraftDto } from "../../../providerApplication/application/dtos/BusinessDraftDto";
import { GetProviderDto } from "../dtos/GetProviderDto";
import { GetProviderResponseDto } from "../../../providerApplication/application/dtos/GetProviderResponseDto";

export class GetProviderUsecase implements IUsecase<GetProviderDto, Provider | null> {
    constructor(
        private readonly providerRepo: IProviderRepository,
    ) { }

    async execute(data: GetProviderDto): Promise<Provider | null> {
        if (!data.id) throw new BadRequestError("Please provide user id")
        
        console.log(data)
    
        let provider = await this.providerRepo.findById(data.id)
        if (!provider) {
            provider = await this.providerRepo.findByUserId(data.id)
        }

        console.log("Provider is : ",provider)

        return provider
    }
}