import { Router } from "express";
import { ROUTES } from "../constants/ROUTES";
import { AdminProvMangeControllerType } from "../../container";

export const createAdminProviderManageRoutes = (controllers:AdminProvMangeControllerType):Router => {
    const router = Router()

    router.get(ROUTES.GET_PROVIDERS, controllers.fetchProvidersController.fetchProviders)
    router.get(ROUTES.GET_PROVIDER, controllers.getProviderController.getProvider)

    return router
}