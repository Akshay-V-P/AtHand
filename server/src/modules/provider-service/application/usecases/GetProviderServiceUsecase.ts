import { ProviderService } from "../../domain/entities/ProviderService";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";

export class GetProviderServiceUsecase {
    constructor(private providerServiceRepository: IProviderServiceRepository) { }

    async execute(id: string): Promise<ProviderService | null> {
        return this.providerServiceRepository.findById(id);
    }
}
