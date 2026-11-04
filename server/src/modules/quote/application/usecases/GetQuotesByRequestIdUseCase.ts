import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";

export class GetQuotesByRequestIdUseCase implements IUsecase<{ requestId: string }, Quote[]> {
    constructor(private readonly quoteRepository: IQuoteRepository) { }

    async execute(data: { requestId: string }): Promise<Quote[]> {
        return await this.quoteRepository.findByRequestId(data.requestId);
    }
}
