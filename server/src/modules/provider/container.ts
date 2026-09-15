import { FetchPublicProvidersUsecase } from "./application/usecases/FetchPublicProvidersUsecase";
import { ProviderRepository } from "./infrastructure/database/repositories/ProviderRepository";
import { FetchPublicProvidersController } from "./presentation/controllers/FetchPublicProvidersController";
import { createProviderRoutes } from "./presentation/routes/provider.routes";

const providerRepository = new ProviderRepository();

const fetchPublicProvidersUsecase = new FetchPublicProvidersUsecase(providerRepository);

const fetchPublicProvidersController = new FetchPublicProvidersController(fetchPublicProvidersUsecase);

const controllers = {
    fetchPublicProvidersController,
};

export type ProviderControllerType = typeof controllers;

export const providerRoutes = createProviderRoutes(controllers);
