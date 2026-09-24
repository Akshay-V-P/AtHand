import { ProviderServiceRepository } from "./infrastructure/database/repositories/ProviderServiceRepository";
import { CreateProviderServiceUsecase } from "./application/usecases/CreateProviderServiceUsecase";
import { GetProviderServiceUsecase } from "./application/usecases/GetProviderServiceUsecase";
import { GetProviderServicesUsecase } from "./application/usecases/GetProviderServicesUsecase";
import { UpdateProviderServiceUsecase } from "./application/usecases/UpdateProviderServiceUsecase";
import { ProviderServiceController } from "./presentation/controllers/ProviderServiceController";
import { createProviderServiceRoutes } from "./presentation/routes/provider-service.routes";

const providerServiceRepository = new ProviderServiceRepository();

const createProviderServiceUsecase = new CreateProviderServiceUsecase(providerServiceRepository);
const getProviderServiceUsecase = new GetProviderServiceUsecase(providerServiceRepository);
const getProviderServicesUsecase = new GetProviderServicesUsecase(providerServiceRepository);
const updateProviderServiceUsecase = new UpdateProviderServiceUsecase(providerServiceRepository);

const providerServiceController = new ProviderServiceController(
    createProviderServiceUsecase,
    getProviderServiceUsecase,
    getProviderServicesUsecase,
    updateProviderServiceUsecase
);

const providerServiceControllers = {
    providerServiceController
};

export type ProviderServiceControllerType = typeof providerServiceControllers;
export const providerServiceRoutes = createProviderServiceRoutes(providerServiceControllers);
