import { ProviderServiceRepository } from "../provider-service/infrastructure/database/repositories/ProviderServiceRepository";
import { FetchPublicProvidersUsecase } from "./application/usecases/FetchPublicProvidersUsecase";
import { GetPublicProviderProfileUsecase } from "./application/usecases/GetPublicProviderProfileUsecase";
import { ProviderRepository } from "./infrastructure/database/repositories/ProviderRepository";
import { FetchPublicProvidersController } from "./presentation/controllers/FetchPublicProvidersController";
import { GetPublicProviderProfileController } from "./presentation/controllers/GetPublicProviderProfileController";
import { createProviderRoutes } from "./presentation/routes/provider.routes";

const providerRepository = new ProviderRepository();
const providerServiceRepository = new ProviderServiceRepository();

const fetchPublicProvidersUsecase = new FetchPublicProvidersUsecase(providerRepository);
const getPublicProviderProfileUsecase = new GetPublicProviderProfileUsecase(
    providerRepository,
    providerServiceRepository
);

const fetchPublicProvidersController = new FetchPublicProvidersController(fetchPublicProvidersUsecase);
const getPublicProviderProfileController = new GetPublicProviderProfileController(
    getPublicProviderProfileUsecase
);

const controllers = {
    fetchPublicProvidersController,
    getPublicProviderProfileController,
};

export type ProviderControllerType = typeof controllers;

export { providerRepository };
export const providerRoutes = createProviderRoutes(controllers);

