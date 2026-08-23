import { Router } from "express";
import { ROUTES } from "../constants/ROUTES";
import { AdminProvMangeControllerType } from "../../container";

export const createAdminProviderManageRoutes = (controllers:AdminProvMangeControllerType):Router => {
    const router = Router()

    router.get(ROUTES.GET_PROVIDERS, controllers.fetchProvidersController.fetchProviders)
    router.route(ROUTES.PROVIDER)
        .get(controllers.getProviderController.getProvider)
    router.get(ROUTES.GET_DOCUMENTS, controllers.getDocumentsController.getDocuments)
    router.patch(ROUTES.GET_DOCUMENT, controllers.updateDocumentController.updateDocument)
    router.patch(ROUTES.UPDATE_PROVIDER_STATUS, controllers.updateProviderStatusController.updateProvider)

    return router
}