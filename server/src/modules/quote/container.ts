import { QuoteRepository } from "./infrastructure/database/repositories/QuoteRepository";
import { CreateQuoteUseCase } from "./application/usecases/CreateQuoteUseCase";
import { GetQuoteUseCase } from "./application/usecases/GetQuoteUseCase";
import { EditQuoteUseCase } from "./application/usecases/EditQuoteUseCase";
import { GetProviderQuotesUseCase } from "./application/usecases/GetProviderQuotesUseCase";
import { GetQuotesByRequestIdUseCase } from "./application/usecases/GetQuotesByRequestIdUseCase";
import { QuoteController } from "./presentation/controllers/QuoteController";
import { createQuoteRoutes } from "./presentation/routes/quote.routes";

const quoteRepository = new QuoteRepository();

const createQuoteUseCase = new CreateQuoteUseCase(quoteRepository);
const getQuoteUseCase = new GetQuoteUseCase(quoteRepository);
const editQuoteUseCase = new EditQuoteUseCase(quoteRepository);
const getProviderQuotesUseCase = new GetProviderQuotesUseCase(quoteRepository);
const getQuotesByRequestIdUseCase = new GetQuotesByRequestIdUseCase(quoteRepository);

const quoteController = new QuoteController(
    createQuoteUseCase,
    getQuoteUseCase,
    editQuoteUseCase,
    getProviderQuotesUseCase,
    getQuotesByRequestIdUseCase
);

export const quoteRoutes = createQuoteRoutes(quoteController);
