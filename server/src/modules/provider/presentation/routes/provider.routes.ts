import { Router } from "express";
import { ProviderControllerType } from "../../container";

export const createProviderRoutes = (controllers: ProviderControllerType): Router => {
    const router = Router();

    router.get('/', controllers.fetchPublicProvidersController.handler);

    return router;
}
