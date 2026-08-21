import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../domain/entities/Provider";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { UpdateProviderDto } from "../dtos/UpdateProviderDto";

export class UpdateProviderUsecase implements IUsecase<UpdateProviderDto, Provider>{
    constructor(
        private readonly providerRepo: IProviderRepository,
    ) { }
    
    async execute(data: UpdateProviderDto): Promise<Provider> {
        const provider = await this.providerRepo.update(data.id, data.updateData)
        if (!provider) throw new NotFoundError("Provider not fount")
        return provider
    }
}