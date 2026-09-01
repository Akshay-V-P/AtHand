import { IUserRepository } from "../auth/domain/repositories/IUserRepository";
import { UserRepository } from "../auth/infrastructure/database/repositories/UserRepository";
import { BlockUserUsecase } from "./application/usecases/BlockUserUsecase";
import { GetAllUsersUsecase } from "./application/usecases/GetAllUserUsecase";
import { GetUserUsecase } from "./application/usecases/GetUserUsecase";
import { UnblockUserUsecase } from "./application/usecases/UnblockUserUsecase";
import { UpdateUserUsecase } from "./application/usecases/UpdateUserUsecase";
import { BlockUserController } from "./presentation/controllers/user-management-controllers/BlockUserController";
import { FetchUsersController } from "./presentation/controllers/user-management-controllers/FetchUserController";
import { GetUserController } from "./presentation/controllers/user-management-controllers/GetUserController";
import { UnblockUserController } from "./presentation/controllers/user-management-controllers/UnblockUserController";
import { UpdateUserController } from "./presentation/controllers/user-management-controllers/UpdateUserController";
import { createAdminUserManagementRoute } from "./presentation/routes/AdminUserMang.route";

const userRepository = new UserRepository()

const getAllUserUsecase = new GetAllUsersUsecase(userRepository)
const getUserUsecase = new GetUserUsecase(userRepository)
const updateUserUsecase = new UpdateUserUsecase(userRepository)
const blockUserUsecase = new BlockUserUsecase(userRepository)
const unblockUserUsecase = new UnblockUserUsecase(userRepository)

const fetchUsersController = new FetchUsersController(getAllUserUsecase)
const updateUserController = new UpdateUserController(updateUserUsecase)
const getUserController = new GetUserController(getUserUsecase)
const blockUserController = new BlockUserController(blockUserUsecase)
const unblockUserController = new UnblockUserController(unblockUserUsecase)

const controllers = {
    fetchUsersController,
    updateUserController,
    getUserController,
    blockUserController,
    unblockUserController
}

export type AdminUserMangControllerType = typeof controllers

export const adminUserMangRoutes = createAdminUserManagementRoute(controllers)
