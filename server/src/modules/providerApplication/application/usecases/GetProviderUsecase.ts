import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { BusinessDetailsDraftDto } from "../dtos/BusinessDraftDto";
import { GetProviderDto } from "../dtos/GetProviderDto";
import { GetProviderResponseDto } from "../dtos/GetProviderResponseDto";

export class GetProviderUsecase implements IUsecase<GetProviderDto, GetProviderResponseDto>{
    constructor(
        private readonly providerRepo:IProviderRepository,
    ) { }
    
    async execute(data: GetProviderDto): Promise<GetProviderResponseDto> {
        if (!data.userId) throw new BadRequestError("Please provide user id")
        
        const provider = await this.providerRepo.findByUserId(data.userId)
        if (!provider) throw new NotFoundError("Provider not found")
        const responseData = {
            id: provider.id!,
            userId: provider.userId,
            businessName: provider.businessName,
            status:provider.status,
        }
        return responseData
    }
}