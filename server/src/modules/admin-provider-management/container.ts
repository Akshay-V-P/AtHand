import { GetProviderUsecase } from "../provider/application/usecases/GetProviderUsecase";
import { ProviderRepository } from "../provider/infrastructure/database/repositories/ProviderRepository";
import { FetchProvidersUsecase } from "./application/usecases/FetchProvidersUsecase";
import { FetchProvidersController } from "./presentation/controllers/ProviderControllers/FetchProvidersController";
import { GetProviderController } from "./presentation/controllers/ProviderControllers/GetProviderController";
import { createAdminProviderManageRoutes } from "./presentation/routes/adminProvManage.routes";

const providerRepository = new ProviderRepository()

const fetchProvidersUsecase = new FetchProvidersUsecase(providerRepository)
const getProviderUsecase = new GetProviderUsecase(providerRepository)

const fetchProvidersController = new FetchProvidersController(fetchProvidersUsecase)
const getProviderController = new GetProviderController(getProviderUsecase)

const controllers = {
    fetchProvidersController,
    getProviderController
}

export type AdminProvMangeControllerType = typeof controllers

export const adminProvManageRoutes = createAdminProviderManageRoutes(controllers)