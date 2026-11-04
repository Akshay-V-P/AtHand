import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";

interface GetQuoteDto {
    id: string;
}

export class GetQuoteUseCase implements IUsecase<GetQuoteDto, Quote> {
    constructor(private quoteRepository: IQuoteRepository) { }

    async execute(dto: GetQuoteDto): Promise<Quote> {
        const quote = await this.quoteRepository.findById(dto.id);
        if (!quote) {
            throw new Error("Quote not found");
        }
        return quote;
    }
}
