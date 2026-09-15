import { Router } from "express";
import { CategoryControllerType } from "../../container";
import { CATEGORY_ROUTES } from "../constants/CATEGORY_ROUTES";

export const createCategoryRoutes = (controllers: CategoryControllerType): Router => {
    const router = Router();

    router.get(
        CATEGORY_ROUTES.ACTIVE_DROPDOWN,
        controllers.getAllCategoryController.handle
    );

    return router;
}
