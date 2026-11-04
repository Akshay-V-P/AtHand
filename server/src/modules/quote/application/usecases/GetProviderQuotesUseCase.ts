import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";

export class GetProviderQuotesUseCase implements IUsecase<{ providerId: string; page?: number; limit?: number }, { data: Quote[], count: number }> {
    constructor(private readonly quoteRepository: IQuoteRepository) { }

    async execute(input: { providerId: string; page?: number; limit?: number }): Promise<{ data: Quote[], count: number }> {
        const skip = ((input.page || 1) - 1) * (input.limit || 50);
        return this.quoteRepository.findByProviderId(input.providerId, skip, input.limit || 50);
    }
}
