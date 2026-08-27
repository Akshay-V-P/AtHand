import { BlockCategoryUsecase } from "../category/application/usecases/BlockCategoryUsecase";
import { CreateCategoryUsecase } from "../category/application/usecases/CreateCategoryUsecase";
import { GetCategoryUsecase } from "../category/application/usecases/GetCategoryUsecase";
import { UnblockCategoryUsecase } from "../category/application/usecases/UnblockCategoryUsecase";
import { UpdateCategoryUsecase } from "../category/application/usecases/UpdateCategoryUsecase";
import { CategoryMangementRepository } from "../category/infrastructure/database/repositories/CategoryMangementRepository";
import { CategoryRepository } from "../category/infrastructure/database/repositories/CategroryRepository";
import { GetAllCategoriesUsecase } from "./application/usecases/GetAllCategoriesUsecase";
import { BlockCategoryController } from "./presentation/controllers/category-controllers/BlockCategoryController";
import { CreateCategoryController } from "./presentation/controllers/category-controllers/CreateCategoryController";
import { GetAllCategoriesController } from "./presentation/controllers/category-controllers/GetAllCategoriesController";
import { GetCategoryController } from "./presentation/controllers/category-controllers/GetCategoryController";
import { UnblockCategoryController } from "./presentation/controllers/category-controllers/UnblockCategoryController";
import { UpdateCategoryController } from "./presentation/controllers/category-controllers/UpdateCategoryController";
import { createAdminCategoryRoutes } from "./presentation/routes/adminCategory.routes";

const categoryRepository = new CategoryRepository()
const categoryMangementRepository = new CategoryMangementRepository()

const createCategoryUsecase = new CreateCategoryUsecase(categoryRepository)
const getCategoryUsecase = new GetCategoryUsecase(categoryRepository)
const updateCategoryUsecase = new UpdateCategoryUsecase(categoryRepository)
const getAllCategoriesUsecase = new GetAllCategoriesUsecase(categoryMangementRepository)
const blockCategoryUsecase = new BlockCategoryUsecase(categoryRepository)
const unblockCategoryUsecase = new UnblockCategoryUsecase(categoryRepository)

const createCategoryController = new CreateCategoryController(createCategoryUsecase)
const getCategoryController = new GetCategoryController(getCategoryUsecase)
const updateCategoryController = new UpdateCategoryController(updateCategoryUsecase)
const getAllCategoriesController = new GetAllCategoriesController(getAllCategoriesUsecase)
const blockCategoryController = new BlockCategoryController(blockCategoryUsecase)
const unblockCategoryController = new UnblockCategoryController(unblockCategoryUsecase)

const categoryControllers = {
    createCategoryController,
    getCategoryController,
    updateCategoryController,
    getAllCategoriesController,
    blockCategoryController,
    unblockCategoryController,
}

export type CategoryControllerType = typeof categoryControllers
export const categoryAdminRoutes = createAdminCategoryRoutes(categoryControllers)