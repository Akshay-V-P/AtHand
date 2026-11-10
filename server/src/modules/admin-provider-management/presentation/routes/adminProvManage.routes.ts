import { Router } from "express";
import { validate } from "../../../../shared/middleware/ValidationMiddleware";
import { AdminProvMangeControllerType } from "../../container";
import { ROUTES } from "../constants/ROUTES";
import {
    adminUpdateProviderServiceSchema,
    blockProviderServiceSchema,
} from "../validators/providerServiceAdmin.schema";

export const createAdminProviderManageRoutes = (controllers: AdminProvMangeControllerType): Router => {
    const router = Router();

    router.get(ROUTES.GET_PROVIDERS, controllers.fetchProvidersController.fetchProviders);
    router.route(ROUTES.PROVIDER)
        .get(controllers.getProviderController.getProvider)
        .patch(controllers.updateProviderController.updateProvider);
    router.get(ROUTES.GET_DOCUMENTS, controllers.getDocumentsController.getDocuments);
    router.patch(ROUTES.GET_DOCUMENT, controllers.updateDocumentController.updateDocument);
    router.patch(ROUTES.UPDATE_PROVIDER_STATUS, controllers.updateProviderStatusController.updateProvider);

    router.get(ROUTES.PROVIDER_SERVICES, controllers.getProviderServicesController.getServices);
    router.patch(
        ROUTES.PROVIDER_SERVICE_BY_ID,
        validate(adminUpdateProviderServiceSchema),
        controllers.updateProviderServiceController.updateService
    );
    router.patch(
        ROUTES.BLOCK_PROVIDER_SERVICE,
        validate(blockProviderServiceSchema),
        controllers.blockProviderServiceController.blockService
    );
    router.patch(
        ROUTES.UNBLOCK_PROVIDER_SERVICE,
        controllers.unblockProviderServiceController.unblockService
    );

    return router;
};
