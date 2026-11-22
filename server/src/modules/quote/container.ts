import { ProviderRepository } from "../provider/infrastructure/database/repositories/ProviderRepository";
import { ServiceRequestRepository } from "../service-request/infrastructure/database/repositories/ServiceRequestRepository";
import { QuoteRepository } from "./infrastructure/database/repositories/QuoteRepository";
import { CreateQuoteUseCase } from "./application/usecases/CreateQuoteUseCase";
import { GetQuoteUseCase } from "./application/usecases/GetQuoteUseCase";
import { EditQuoteUseCase } from "./application/usecases/EditQuoteUseCase";
import { GetProviderQuotesUseCase } from "./application/usecases/GetProviderQuotesUseCase";
import { GetQuotesByRequestIdUseCase } from "./application/usecases/GetQuotesByRequestIdUseCase";
import { QuoteController } from "./presentation/controllers/QuoteController";
import { createQuoteRoutes } from "./presentation/routes/quote.routes";

const quoteRepository = new QuoteRepository();
const serviceRequestRepository = new ServiceRequestRepository();
const providerRepository = new ProviderRepository();

const createQuoteUseCase = new CreateQuoteUseCase(
    quoteRepository,
    serviceRequestRepository,
    providerRepository
);
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
