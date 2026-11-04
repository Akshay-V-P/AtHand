import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { EditQuoteDto } from "../dtos/EditQuoteDto";
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/interfaces/IQuoteRepository";
import { QuoteStatus } from "../../domain/enums/QuoteStatus";

export class EditQuoteUseCase implements IUsecase<EditQuoteDto, Quote> {
    constructor(private quoteRepository: IQuoteRepository) { }

    async execute(dto: EditQuoteDto): Promise<Quote> {
        const existingQuote = await this.quoteRepository.findById(dto.id);

        if (!existingQuote) {
            throw new Error("Quote not found");
        }

        if (existingQuote.providerId.toString() !== dto.providerId) {
            throw new Error("Not authorized to edit this quote");
        }

        if (existingQuote.status !== QuoteStatus.PENDING) {
            throw new Error("Only pending quotes can be edited");
        }

        const { id, providerId, ...updateData } = dto;

        const updatedQuote = await this.quoteRepository.update(id, updateData);
        if (!updatedQuote) {
            throw new Error("Failed to update quote");
        }
        return updatedQuote;
    }
}
