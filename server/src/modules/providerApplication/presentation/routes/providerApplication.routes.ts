import { Router } from "express";
import { PROV_APP_ROUTES } from "../constants/routeConstants";
import { ProvAppController, ProvAppMiddlewares } from "../../container";

export function createProviderApplicationRoute(controllers:ProvAppController, middlewares:ProvAppMiddlewares): Router {
    const router = Router()

    router.post(PROV_APP_ROUTES.CREATE_PROVIDER, middlewares.validateCreateProvider , controllers.createProviderController.createProvider)
    router.post(PROV_APP_ROUTES.UPLOAD_DOCUMENT, middlewares.validateuploadDocument, controllers.uploadDocumentController.upload),
    router.patch(PROV_APP_ROUTES.UPLOAD_PROVIDER_DRAFT, controllers.uploadDraftController.uploadDraft)

    return router
}