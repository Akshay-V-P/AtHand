import { Router } from "express";
import { AddressControllerType } from "../../container";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/AuthMiddleware";

export const createAddressRoutes = (controllers: AddressControllerType, authMiddleware: AuthMiddleware): Router => {
    const router = Router();

    router.use(authMiddleware.execute);

    router.route('/')
        .post(controllers.addAddressController.handle)
        .get(controllers.getAddressesController.handle);

    router.route('/:id')
        .put(controllers.updateAddressController.handle)
        .delete(controllers.deleteAddressController.handle);

    return router;
}
