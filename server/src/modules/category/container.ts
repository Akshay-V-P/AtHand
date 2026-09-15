import { CategoryRepository } from "./infrastructure/database/repositories/CategroryRepository";
import { GetActiveCategoriesDropdownUsecase } from "./application/usecases/GetActiveCategoriesDropdownUsecase";
import { GetAllCategoryController } from "./presentation/controllers/GetAllCategoryController";
import { createCategoryRoutes } from "./presentation/routes/category.routes";


const categoryRepository = new CategoryRepository();

const getActiveCategoriesDropdownUsecase = new GetActiveCategoriesDropdownUsecase(categoryRepository);

const getAllCategoryController = new GetAllCategoryController(getActiveCategoriesDropdownUsecase);

const categoryControllers = {
    getAllCategoryController
};

export type CategoryControllerType = typeof categoryControllers;

export const categoryRoutes = createCategoryRoutes(categoryControllers);
