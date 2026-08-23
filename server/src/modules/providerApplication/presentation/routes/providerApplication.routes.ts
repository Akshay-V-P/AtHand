import { Router } from "express";
import { PROV_APP_ROUTES } from "../constants/routeConstants";
import { ProvAppController, ProvAppMiddlewares } from "../../container";

export function createProviderApplicationRoute(controllers:ProvAppController, middlewares:ProvAppMiddlewares): Router {
    const router = Router()

    router.post(PROV_APP_ROUTES.CREATE_PROVIDER, middlewares.validateCreateProvider , controllers.createProviderController.createProvider)
    router.post(PROV_APP_ROUTES.UPLOAD_DOCUMENT, middlewares.validateuploadDocument, controllers.uploadDocumentController.upload),
        router.patch(PROV_APP_ROUTES.UPDATE_PROVIDER_DRAFT, middlewares.validateUploadProviderDraft, controllers.uploadDraftController.uploadDraft)
    router.post(PROV_APP_ROUTES.PRESIGNED_URL, controllers.createUploadUrlController.createUploadUrl)
    router.post(PROV_APP_ROUTES.GET_DRAFT, controllers.getProviderDraftController.getProviderDraft)
    router.get(PROV_APP_ROUTES.GET_PROVIDER, controllers.getProviderController.getProvider)
    router.post(PROV_APP_ROUTES.GET_DISPLAY_URL, controllers.getDisplayImageUrlController.getDisplayUrl)
    router.patch(PROV_APP_ROUTES.UPDATE_PROVIDER, controllers.updateProviderController.updateProvider)

    return router
}