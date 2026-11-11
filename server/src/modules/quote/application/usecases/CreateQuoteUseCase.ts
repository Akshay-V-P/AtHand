import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { CreateQuoteDto } from "../dtos/CreateQuoteDto";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";
import { QuoteStatus } from "../../domain/enums/QuoteStatus";

export class CreateQuoteUseCase implements IUsecase<CreateQuoteDto, Quote> {
    constructor(private quoteRepository: IQuoteRepository) { }

    async execute(dto: CreateQuoteDto): Promise<Quote> {
        
        const quote = new Quote(
            dto.requestId,
            dto.providerId,
            dto.estimatedTotal,
            dto.laborCost,
            dto.partsCost,
            dto.estimatedRepairTime,
            dto.technicalNotes,
            QuoteStatus.PENDING,
            dto.includeWarrenty
        );

        return await this.quoteRepository.create(quote);
    }
}
