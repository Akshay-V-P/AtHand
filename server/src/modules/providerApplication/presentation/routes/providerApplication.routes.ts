import { Router } from "express";
import { PROV_APP_ROUTES } from "../constants/routeConstants";
import { ProvAppController } from "../../container";

export function createProviderApplicationRoute(controllers:ProvAppController): Router {
    const router = Router()

    router.post(PROV_APP_ROUTES.CREATE_PROVIDER, controllers.createProviderController.createProvider)
    router.post(PROV_APP_ROUTES.UPLOAD_DOCUMENT, controllers.uploadDocumentController.upload)

    return router
}