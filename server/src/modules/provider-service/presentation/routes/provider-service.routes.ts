import { Router } from "express";
import { ProviderServiceControllerType } from "../../container";
import { PROVIDER_SERVICE_ROUTES } from "../constants/PROVIDER_SERVICE_ROUTES";

export const createProviderServiceRoutes = (controllers: ProviderServiceControllerType) => {
    const router = Router();
    const { providerServiceController } = controllers;

    router.post(PROVIDER_SERVICE_ROUTES.ROOT, providerServiceController.create);
    router.get(PROVIDER_SERVICE_ROUTES.ROOT, providerServiceController.getAll);
    router.get(PROVIDER_SERVICE_ROUTES.BY_ID, providerServiceController.getById);
    router.put(PROVIDER_SERVICE_ROUTES.BY_ID, providerServiceController.update);

    return router;
};
