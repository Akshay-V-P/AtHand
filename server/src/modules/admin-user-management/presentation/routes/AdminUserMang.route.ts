import { Router } from "express";
import { AdminUserMangControllerType } from "../../container";
import { USER_MANG_ROUTES } from "../constants/USER_MANG_ROUTES";

export const createAdminUserManagementRoute = (controllers:AdminUserMangControllerType):Router => {
    const router = Router()

    router.get(USER_MANG_ROUTES.USERS, controllers.fetchUsersController.fetchUsers)

    router.get(USER_MANG_ROUTES.USER, controllers.getUserController.getUser)
    router.patch(USER_MANG_ROUTES.USER, controllers.updateUserController.updateUser)

    router.patch(USER_MANG_ROUTES.BLOCK_USER, controllers.blockUserController.blockUser)
    router.patch(USER_MANG_ROUTES.UNBLOCK_USER, controllers.unblockUserController.unblockUser)

    return router
}