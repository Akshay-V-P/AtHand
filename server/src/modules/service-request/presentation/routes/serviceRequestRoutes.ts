import { Router } from "express";
import { ServiceRequestControllerType } from "../../container";
import { authMiddleware } from "../../../auth/container";

export const createServiceRequestRoutes = (controllers: ServiceRequestControllerType) => {
    const router = Router();
    const {
        createController,
        updateController,
        cancelController,
        getServiceRequestController,
        getServiceRequestsController,
        getNearbyServiceRequestsController
    } = controllers;

    // Apply authentication middleware
    router.use(authMiddleware.execute);

    // Routes
    router.get('/nearby', getNearbyServiceRequestsController.getNearby);
    router.post('/', createController.create);
    router.get('/', getServiceRequestsController.list);
    router.get('/:id', getServiceRequestController.get);
    router.patch('/:id', updateController.update);
    router.patch('/:id/cancel', cancelController.cancel);

    return router;
};
