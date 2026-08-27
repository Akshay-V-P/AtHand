import { Router } from "express"
import { CategoryControllerType } from "../../container"
import { CATEGORY_ROUTS } from "../constants/CATEGORY_ROUTES"

export const createAdminCategoryRoutes = (controllers:CategoryControllerType):Router => {
    const router = Router()

    router.route(CATEGORY_ROUTS.CATEGORY)
        .put(controllers.createCategoryController.handle)
        .get(controllers.getAllCategoriesController.handle)
    

    router.route(CATEGORY_ROUTS.GET_CATEGORY)
        .get(controllers.getCategoryController.handle)
        .patch(controllers.updateCategoryController.handle)
    
    router.patch(CATEGORY_ROUTS.BLOCK_STATUS, controllers.blockCategoryController.handle)
    router.patch(CATEGORY_ROUTS.UNBLOCK_STATUS, controllers.unblockCategoryController.handle)
    
    

    return router
}