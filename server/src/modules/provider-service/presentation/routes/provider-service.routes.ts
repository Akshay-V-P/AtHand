import { Router } from "express";
import { ProviderServiceControllerType } from "../../container";
import { PROVIDER_SERVICE_ROUTES } from "../constants/PROVIDER_SERVICE_ROUTES";

export const createProviderServiceRoutes = (controllers: ProviderServiceControllerType) => {
    const router = Router();
    const { createController, getByIdController, getAllController, updateController, getUploadUrlController } = controllers;

    router.post(PROVIDER_SERVICE_ROUTES.ROOT, createController.create);
    router.get(PROVIDER_SERVICE_ROUTES.ROOT, getAllController.getAll);
    router.get(PROVIDER_SERVICE_ROUTES.BY_ID, getByIdController.getById);
    router.put(PROVIDER_SERVICE_ROUTES.BY_ID, updateController.update);
    router.post('/upload-url', getUploadUrlController.create);

    return router;
};
